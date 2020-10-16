import React, { useContext, useState } from "react";
import { Button, FormLabel, Search, Tag } from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import RegistrationContext, {
  CurrentProgress,
} from "../../../context/register-context";
import { Form } from "../../../components";

type InterestsProps = {
  interests: string[];
};

const Interests = (oldState: InterestsProps) => {
  const context = useContext(RegistrationContext);

  const [searchText, setSearchText] = useState("");
  const [interests, _setInterests] = useState(oldState.interests);
  const setInterests = (interests: string[]) => _setInterests(interests.sort());

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchText.length !== 0 && !interests.includes(searchText)) {
        setInterests([searchText, ...interests]);
      }
      setSearchText("");
    }
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.setCurrentProgress(CurrentProgress.PROFILE_IMAGE);
  };

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    context.setRegistrationDetails({ interests });
    context.setCurrentProgress(CurrentProgress.SUMMARY);
  };

  return (
    <Form
      title="Interests"
      caption="Add some topics that interest you"
      submitButtonText="Continue"
      canSubmit={true}
      showPreviousButton={true}
      onSubmit={handleContinue}
      onPrevious={handlePrevious}>
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
          {interests.map((interest, i) => (
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
  );
};

export default Interests;
