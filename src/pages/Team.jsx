import PageHead from "../components/PageHead.jsx";
import TeamCard from "../components/TeamCard.jsx";
import usePageTitle from "../components/usePageTitle.js";
import { GROUPS, TEAM } from "../data/team.js";

export default function Team() {
  usePageTitle("Equipo");

  return (
    <>
      <PageHead title="Equipo">
        Conocé a los coordinadores y colaboradores del club. Hacé clic en cada uno para ver qué usa en el día a día.
      </PageHead>
      <section className="section">
        <div className="wrap">
          {GROUPS.map((group) => {
            const members = TEAM.filter((member) => member.group === group.id);
            if (members.length === 0) return null;
            return (
              <div className="team-group" key={group.id}>
                <h2>{group.title}</h2>
                <div className="team-grid">
                  {members.map((member) => (
                    <TeamCard key={member.slug} member={member} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
