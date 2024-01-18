const nextBtn = document.getElementById("next-page");
const prevBtn = document.getElementById("prev-page");
const selectPageLimit = document.getElementById("page-limit");
const repoContainer = document.getElementById("repo-container");
const loadingContainer = document.getElementById("loading-container");
const profilePic = document.getElementById("profile-pic");
const username = document.getElementById("username");
const userBio = document.getElementById("user-bio");
const userLocation = document.getElementById("user-location");
const otherLinks = document.getElementById("other-links");
const githubLink = document.getElementById("github-link");
let pageNo = 1;

for (let i = 10; i <= 100; i++) {
  const newOption = document.createElement("option");
  newOption.innerHTML = i;
  newOption.value = i;
  selectPageLimit.appendChild(newOption);
}

selectPageLimit.value = 10;

async function getUserData() {
  try {
    const res = await fetch(`https://api.github.com/users/johnpapa`);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

async function getData(perPage, pageNo) {
  try {
    const res = await fetch(
      `https://api.github.com/users/johnpapa/repos?per_page=${perPage}&page=${pageNo}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}

const setLoading = (loading) => {
  if (loading === true) {
    repoContainer.style.display = "none";
    loadingContainer.style.display = "flex";
  } else {
    repoContainer.style.display = "grid";
    loadingContainer.style.display = "none";
  }
};

const main = async (perPage, pageNo) => {
  repoContainer.innerHTML = "";
  setLoading(true);
  const apiData = await getData(perPage, pageNo);
  setLoading(false);

  console.log({ pageNo, perPage, apiData });

  if (pageNo === 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  if (apiData.length < selectPageLimit.value) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }

  let userData = await getUserData();
  console.log(userData);

  profilePic.src = userData.avatar_url;
  username.innerHTML = userData.name;
  userBio.innerHTML = userData.bio;
  userLocation.innerHTML = userData.location;
  otherLinks.innerHTML = userData.blog;
  otherLinks.href = userData.blog;

  githubLink.href = userData.html_url;
  githubLink.innerHTML = userData.html_url;

  apiData.forEach((item) => {
    const newDiv = document.createElement("div");
    document.getElementById("repo-container").appendChild(newDiv);
    newDiv.classList.add("repo");
    newDiv.innerHTML = `
            <div>
                <div>
                    <h2 class="repo-title">${item.name}</h2>
                    <p class="repo-desc">${
                      item.description ? item.description : "No Description"
                    }</p>
                </div>
                <a href='${item.html_url}' target="_blank">Visit Repo</a>
            </div>
    `;

    const newUl = document.createElement("ul");
    newUl.classList.add("topic-list");
    newDiv.appendChild(newUl);

    item.topics.map((topic) => {
      const newLi = document.createElement("li");
      newLi.innerHTML = topic;
      newUl.appendChild(newLi);
      newLi.classList.add("curr-topic");
    });
  });
};

main(selectPageLimit.value, pageNo);

// Adding Event listeners
nextBtn.addEventListener("click", () => {
  pageNo = pageNo + 1;
  main(selectPageLimit.value, pageNo);
});
prevBtn.addEventListener("click", () => {
  pageNo = pageNo - 1;
  main(selectPageLimit.value, pageNo);
});
selectPageLimit.addEventListener("change", async () => {
  const value = selectPageLimit.value;
  main(value, pageNo);
});
