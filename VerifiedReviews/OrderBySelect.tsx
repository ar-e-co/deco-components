import { useState } from "preact/hooks";
import {
  type AnatomyClasses,
  handleClasses,
} from "deco-components/sdk/styles.ts";

const anatomy = [
  "container",
  "label",
  "select",
  "option",
] as const;

export type OrderBySelectClasses = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
  classes?: OrderBySelectClasses;
  label?: string;
}

const options = [
  {
    value: "date_desc",
    name: "Mais recente",
  },
  {
    value: "date_asc",
    name: "Mais antigo",
  },
  {
    value: "rate_desc",
    name: "Maior avaliação",
  },
  {
    value: "rate_asc",
    name: "Menor avaliação",
  },
  {
    value: "most_helpful",
    name: "O Mais util",
  },
];

function OrderBySelect({
  classes,
  label = "Ordenar por",
}: Props) {
  const [selectedValue, setSelectedValue] = useState("date_desc");

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    setSelectedValue(target.value);
  }

  return (
    <div class={classes?.container}>
      <label for="verified-reviews-sort" class={classes?.label}>{label}</label>

      <select
        id="verified-reviews-sort"
        name="sort"
        class={handleClasses(
          "ml-1 text-base-content cursor-pointer outline-none bg-transparent",
          classes?.select,
        )}
        onChange={handleChange}
        value={selectedValue}
      >
        {options.map((option) => (
          <option
            value={option.value}
            name={option.value}
            selected={selectedValue === option.value}
            class={handleClasses("text-base-content", classes?.option)}
          >
            <span>{option.name}</span>
          </option>
        ))}
      </select>
    </div>
  );
}

export default OrderBySelect;
