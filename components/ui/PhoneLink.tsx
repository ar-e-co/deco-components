function PhoneLink(
  { phone, anchorClass }: { phone: string; anchorClass?: string },
) {
  let phoneFormatted = phone.replace(/\D/g, "");

  if (phoneFormatted.startsWith("55")) {
    phoneFormatted = `+${phoneFormatted}`;
  } else if (!phoneFormatted.startsWith("+55")) {
    phoneFormatted = `+55${phoneFormatted}`;
  }

  if (phoneFormatted[3] === "0") {
    phoneFormatted = phoneFormatted.replace("0", "");
  }

  return (
    <a
      class={anchorClass}
      href={`tel:${phoneFormatted}`}
    >
      {phone}
    </a>
  );
}

export default PhoneLink;
