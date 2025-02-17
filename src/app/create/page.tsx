import { Stepper } from "@/components/CreateForm/stepper/Stepper";
import { NameAndTags } from "@/components/CreateForm/steps/name-tags/NameAndTags";
import { BioSection } from "@/components/CreateForm/steps/bio/BioSection";
import { MediaSection } from "@/components/CreateForm/steps/media/MediaSection";

const steps = [
  {
    id: 1,
    title: "Name and Tags",
    content: <NameAndTags />,
  },
  {
    id: 2,
    title: "Bio Information",
    content: <BioSection />,
  },
  {
    id: 3,
    title: "Media Upload",
    content: <MediaSection />,
  },
];

const CreateForm = () => {
  return (
    <div className="w-full  flex-col-center gap-16  p-4">
      <h1 className="h1">Create Your Own Community</h1>
      <Stepper steps={steps} />
    </div>
  );
};

export default CreateForm;
