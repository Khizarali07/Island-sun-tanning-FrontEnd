import "../CSS/PackageList.css";

function Packages() {
  const getExpirationString = (pack) => {
    if (pack.isUnlimited && pack.duration && pack.durationUnit) {
      return `Expires in ${pack.duration} ${pack.durationUnit}`;
    }
    return "No expiration";
  };

  return (
    <div className="package-list-container">
      <h2 className="package-list-title">Available Packages</h2>
      <div className="cards">
        {packages.map((pack, index) => (
          <div key={pack._id} className={`card card-${(index % 6) + 1}`}>
            <div className="card__icon">
              <i className="fas fa-gift"></i>
            </div>
            <p className="card__exit">
              <button
                onClick={() => deletePackage(pack._id)}
                className="delete-icon-button"
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/30/000000/trash--v1.png"
                  alt="Delete"
                  className="delete-icon"
                />
              </button>
            </p>
            <h2 className="card__title">{pack.name}</h2>
            <p className="card__details">
              {pack.isUnlimited
                ? "Unlimited Redemptions"
                : `${pack.redemptions} Redemptions`}
            </p>
            <p className="card__expiration">{getExpirationString(pack)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Packages;
