import { handleClasses } from "deco-components/sdk/styles.ts";

export interface Props {
  class?: string;
  content: string;
}

function RichTextRenderer({
  content,
  class: _class,
}: Props) {
  return (
    <div
      class={handleClasses(
        "[&>*]:my-3 [&_*]:leading-normal [&_ul]:list-disc [&_ul]:pl-10",
        _class,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default RichTextRenderer;
