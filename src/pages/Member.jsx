import { Suspense } from "react";
import { useParams } from "react-router";
import usePageTitle from "../components/usePageTitle.js";
import { getMember } from "../data/team.js";
import DefaultProfile from "./profiles/DefaultProfile.jsx";
import { PROFILES, hasCustomProfile } from "./profiles/index.js";
import NotFound from "./NotFound.jsx";

export default function Member() {
  const { slug } = useParams();
  const member = getMember(slug);
  usePageTitle(member ? member.name : "Página no encontrada");

  if (!member) return <NotFound />;

  if (hasCustomProfile(slug)) {
    const Profile = PROFILES[slug];
    return (
      <Suspense fallback={<div className="profile-loading" />}>
        <Profile member={member} />
      </Suspense>
    );
  }

  return <DefaultProfile member={member} />;
}
