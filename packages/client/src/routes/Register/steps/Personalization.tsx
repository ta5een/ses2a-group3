import React, { useContext /* useState */, useState } from "react";
import { FileUploader, TextArea } from "carbon-components-react";

import RegistrationContext, { CurrentProgress } from "context/register";
import { Form } from "components";

type PersonalizationProps = {
  // avatar: any;
  about: string;
};

const Personalization = (oldState: PersonalizationProps) => {
  const context = useContext(RegistrationContext);

  // const [avatar, setAvatar] = useState(Buffer.from(undefined, "binary"));
  const [about, setAbout] = useState(oldState.about || "");
  const [showAboutError, setShowAboutError] = useState(false);

  const aboutWordsLength = about
    .trim()
    .split(/\s/g)
    .filter(s => s.length > 0).length;

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.setCurrentProgress(CurrentProgress.ACCOUNT);
  };

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    context.setRegistrationDetails({ about });
    context.setCurrentProgress(CurrentProgress.INTERESTS);
  };

  return (
    <Form
      title="Personalisation"
      caption="Personalise your account with a profile image and a short description about yourself"
      canSubmit={aboutWordsLength >= 5}
      showPreviousButton={true}
      onSubmit={handleContinue}
      onPrevious={handlePrevious}>
      <div className="bx--file__container">
        <FileUploader
          accept={["jpg", "png"]}
          buttonLabel="Upload image"
          filenameStatus="edit"
          iconDescription="Clear file"
          labelDescription="Only .jpg or .png files at 500mb or less"
          labelTitle="Profile image"
          onChange={e => console.log(e.target.value)}
        />
        <TextArea
          light
          cols={40}
          rows={3}
          id="about-text-area"
          labelText="About"
          helperText={`${aboutWordsLength} words`}
          invalid={showAboutError && aboutWordsLength < 5}
          invalidText="Please enter a minimum of 5 words describing yourself"
          placeholder="Enter a short description about yourself"
          value={about}
          onChange={e => {
            setAbout(e.target.value);
            setShowAboutError(aboutWordsLength < 5);
          }}
        />
      </div>
    </Form>
  );
};

export default Personalization;
