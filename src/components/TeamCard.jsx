import { Link } from "react-router";
import Avatar from "./Avatar.jsx";

export default function TeamCard({ member }) {
  return (
    <Link className="team-card" to={`/team/${member.slug}`}>
      <Avatar member={member} size="lg" alt="" />
      <h3 className="team-card-name">{member.name}</h3>
      {member.role && <p className="team-card-role">{member.role}</p>}
    </Link>
  );
}
