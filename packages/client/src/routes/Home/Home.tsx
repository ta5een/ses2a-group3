import React, { useEffect, useState } from "react";
import {
  Search,
  Select,
  SelectItem,
  SkeletonText,
  Tile,
} from "carbon-components-react";

import { AuthApi, InterestApi, UserApi } from "api";
import { GroupList } from "routes/Groups";
import "./Home.scss";

type SelectInterest = { label: string; id?: string };

type HomeContentProps = {
  heading: string;
  disabledSearch: boolean;
  children: React.ReactChild;
  interests?: SelectInterest[];
  selectedInterest?: SelectInterest;
  search?: string;
  setSelectedInterest?: (_: SelectInterest) => void;
  setSearch?: (_: string) => void;
};

const HomeContent = ({
  heading,
  disabledSearch,
  children,
  interests,
  selectedInterest,
  search,
  setSelectedInterest,
  setSearch,
}: HomeContentProps) => {
  return (
    <div>
      <h1>{heading}</h1>
      <div className="home-search-container">
        <Search
          className="home-search"
          disabled={disabledSearch}
          labelText=""
          placeHolderText="Search groups"
          value={search}
          onChange={e => {
            console.log(e.target.value);
            setSearch(e.target.value);
          }}
        />
        <Select
          inline
          id="select-interest"
          defaultValue="All"
          labelText="Filter by interest"
          onChange={e =>
            setSelectedInterest({
              label: e.target.value,
              id: interests.find(it => it.label === e.target.value).id,
            })
          }>
          <SelectItem text="All" value="All" />
          {interests
            ? interests.map((interest, i) => (
                <SelectItem
                  key={i}
                  text={interest.label}
                  value={interest.label}
                />
              ))
            : []}
        </Select>
      </div>
      {children}
    </div>
  );
};

const Home = () => {
  useEffect(() => {
    document.title = "Group Interest – Home";
  });

  const authentication = AuthApi.authentication();
  const { isAuthenticated, id: _id, token } = authentication;

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<SelectInterest[]>([]);

  const [selectedInterest, setSelectedInterest] = useState<SelectInterest>({
    label: "All",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUserAndInterests = async () => {
      const user = await UserApi.readUser({ _id, token });
      setName(user.name);

      const interests = await InterestApi.allInterests();
      const mappedInterests = interests.map(interest => {
        return { label: interest.name, id: interest._id };
      });
      setInterests([{ label: "All" }, ...mappedInterests]);
    };

    if (isAuthenticated) {
      fetchUserAndInterests()
        .then(_ => setIsLoading(false))
        .catch(error => console.error(error));
    }
  }, [isAuthenticated, _id, token, setIsLoading, setName]);

  return (
    <div className="content-container">
      {!isAuthenticated ? (
        <HomeContent
          heading={"Welcome to Group Interest"}
          disabledSearch={true}>
          <div className="home-unauthenticated-container">
            <Tile>
              <p>
                To use Group Interest's features, please{" "}
                <a href="/login">login</a> or <a href="/register">register</a>.
              </p>
            </Tile>
          </div>
        </HomeContent>
      ) : isLoading ? (
        <SkeletonText heading width="200px" />
      ) : (
        <HomeContent
          heading={`Welcome, ${name}`}
          disabledSearch={!isAuthenticated}
          interests={interests}
          selectedInterest={selectedInterest}
          setSelectedInterest={setSelectedInterest}
          search={search}
          setSearch={setSearch}>
          <GroupList
            matches={group => {
              if (selectedInterest.label === "All") {
                return true;
              } else {
                if (search.length > 0) {
                  return (
                    group.interests.includes(selectedInterest.id) &&
                    group.name.includes(search)
                  );
                } else {
                  return group.interests.includes(selectedInterest.id);
                }
              }
            }}
          />
        </HomeContent>
      )}
    </div>
  );
};

export default Home;
