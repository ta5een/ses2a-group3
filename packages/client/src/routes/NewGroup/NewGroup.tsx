import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  FormLabel,
  Search,
  Tag,
  TagSkeleton,
  TextArea,
  TextInput,
} from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import { AuthApi, GroupApi, InterestApi } from "api";
import { Form } from "components";
import "./NewGroup.scss";

const NewGroup = () => {
  useEffect(() => {
    document.title = "Group Interest – New Group";
  });

  const { id: userId, token } = AuthApi.authentication();

  type Outcome = { didFail: boolean; message?: string };
  const [outcome, setOutcome] = useState<Outcome>({ didFail: false });
  const [isLoading, setIsLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [searchText, setSearchText] = useState("");
  const [interests, _setInterests] = useState([
    "C++",
    "Games Development",
    "JavaScript",
    "Web Programming",
  ]);
  const setInterests = (interests: string[]) => _setInterests(interests.sort());

  useEffect(() => {
    const fetchAndSetInterests = async () => {
      try {
        const allInterests = await InterestApi.allInterests();
        const interests = allInterests.map(interest => interest.name);
        setIsLoading(false);
        _setInterests(interests);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchAndSetInterests()
      .then(_ => setIsLoading(false))
      .catch(error => console.error(error));
  }, [setIsLoading, _setInterests]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchText.length !== 0 && !interests.includes(searchText)) {
        setInterests([searchText, ...interests]);
      }
      setSearchText("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setIsLoading(true);
    setOutcome({ didFail: false, message: undefined });

    try {
      const selectedInterests = interests;
      const allInterests = await InterestApi.allInterests();
      const allInterestsNames = allInterests.map(interest => interest.name);

      // Update existing interests
      const existingInterests = allInterests
        .filter(interest => selectedInterests.includes(interest.name))
        .map(async interest => {
          return await InterestApi.updateInterest(interest._id, token, {
            appendedUser: userId,
          });
        });

      // Create new interests
      const newInterests = selectedInterests
        .filter(interest => !allInterestsNames.includes(interest))
        .map(async interest => {
          return await InterestApi.createInterest({
            name: interest,
            appendedUser: userId,
          });
        });

      // Resolve all interests
      const pendingRequests = [...existingInterests, ...newInterests];
      const resolvedInterests = await Promise.all(pendingRequests);

      GroupApi.createGroup(userId, token, {
        moderator: userId,
        name: groupName,
        description: groupDescription,
        interests: resolvedInterests.map(interest => interest._id),
      })
        .then(_ => {
          console.log("Successfully created group. Redirecting...");
          // setIsLoading(false);
          setOutcome({ didFail: false });
          setRedirect(true);
        })
        .catch(error => {
          console.error(`Failed to create group: ${error}`);
          // setIsLoading(false);
          setOutcome({ didFail: true, message: error.message || error });
        });
    } catch (error) {
      setIsLoading(false);
      setOutcome({ didFail: true, message: error.message });
    }
  };

  if (redirect) {
    return <Redirect to="/groups" />;
  }

  return (
    <div>
      <Form
        title="New Group"
        caption="Fill in the details below to create your group"
        submitButtonText="Create group"
        onSubmit={handleSubmit}
        canSubmit={
          groupName.length >= 3 &&
          groupDescription.length > 0 &&
          interests.length >= 3
        }
        isError={outcome.didFail}
        errorMessage={outcome.message}>
        <TextInput
          light
          id="name"
          labelText="Group name"
          placeholder="Enter a group name"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
        />
        <TextArea
          light
          rows={3}
          id="description"
          labelText="Group description"
          placeholder="Enter a short description about your group"
          value={groupDescription}
          onChange={e => setGroupDescription(e.target.value)}
        />
        <div style={{ display: "flex", alignContent: "flex-end" }}>
          <Search
            light
            id="interests-search"
            labelText="Interests"
            placeHolderText="Type in an interest..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <Button
            hasIconOnly
            renderIcon={Add16}
            iconDescription="Add Interest"
            disabled={searchText.length === 0}
            onClick={_ => setInterests([searchText, ...interests])}
          />
        </div>
        <div className="tags">
          <FormLabel>Selected interests</FormLabel>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
            {isLoading
              ? [...Array(12).keys()].map((_, i) => <TagSkeleton key={i} />)
              : interests.map((interest, i) => (
                  <Tag
                    key={i}
                    filter
                    title="Clear filter"
                    type="cool-gray"
                    onClose={_ =>
                      setInterests([
                        ...interests.slice(0, i),
                        ...interests.slice(i + 1),
                      ])
                    }>
                    {interest}
                  </Tag>
                ))}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default NewGroup;
