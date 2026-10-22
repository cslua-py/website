export default function PageHead({ title, children }) {
  return (
    <div className="page-head">
      <div className="wrap">
        <h1>{title}</h1>
        {children && <p className="sub">{children}</p>}
      </div>
    </div>
  );
}
