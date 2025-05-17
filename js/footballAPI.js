document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector(".eplTable tbody");

  fetch("standings.php")
    .then((res) => res.json())
    .then((data) => {
      const standings = data.standings[0].table;
      tableBody.innerHTML = "";

      standings.forEach((team) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${team.position}</td>
            <td>${team.team.name}</td>
            <td>${team.goalDifference >= 0 ? "+" : ""}${
          team.goalDifference
        }</td>
            <td>${team.goalsFor - team.goalsAgainst}</td>
            <td>${team.points}</td>
          `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Premier Lig verisi alınamadı:", err);
      tableBody.innerHTML =
        "<tr><td colspan='5'>Premier Lig tablosu yüklenemedi.</td></tr>";
    });
});
