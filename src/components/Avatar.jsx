function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export default function Avatar({ member, size = "md" }) {
  if (member.photo) {
    return (
      <img
        className={`avatar avatar-${size}`}
        src={`${import.meta.env.BASE_URL}team/${member.photo}`}
        alt={`Imagen de perfil de ${member.name}`}
      />
    );
  }

  return (
    <span className={`avatar avatar-${size} avatar-initials`} aria-hidden="true">
      {getInitials(member.name)}
    </span>
  );
}
