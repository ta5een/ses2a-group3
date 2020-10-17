import React, { useContext, /* useState */ } from "react";
import { FileUploader } from "carbon-components-react";

import RegistrationContext, {
  CurrentProgress,
} from "context/register-context";
import { Form } from "components";

const Personalization = () => {
  const context = useContext(RegistrationContext);

  // const [avatar, setAvatar] = useState(Buffer.from(undefined, "binary"));

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.setCurrentProgress(CurrentProgress.ACCOUNT);
  };

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    context.setRegistrationDetails({});
    context.setCurrentProgress(CurrentProgress.INTERESTS);
  };

  return (
    <Form
      title="Profile image"
      caption="Select an image to set as your profile image"
      canSubmit={true}
      showPreviousButton={true}
      onSubmit={handleContinue}
      onPrevious={handlePrevious}>
      <div className="bx--file__container">
        <FileUploader
          accept={["jpg", "png"]}
          buttonLabel="Upload image"
          filenameStatus="edit"
          iconDescription="Clear file"
          labelDescription="only .jpg or .png files at 500mb or less"
          labelTitle="Upload"
          onChange={e => console.log(e.target.value)}
        />
      </div>
    </Form>
  );
};

export default Personalization;
