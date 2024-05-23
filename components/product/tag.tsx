import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";

const anatomy = [
  "container"
] as const;

type StylesTag = AnatomyClasses<typeof anatomy[number]>;


export type tagsProps = {
  classes?: StylesTag;
  name: string,
   
};

export default function Tags({name,classes}: tagsProps) {
  return (  
    <span
    key={name}
    class={handleClasses(classes?.container)}
  >
    {name}
  </span>
  );
}
