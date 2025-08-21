function calculate_ATAR(x1) {
  const A = [
    -48.02874, -9.68991, 5.33339, 3.19566, 0.712293, 0.84658, 1.34884, 1.11246,
    0.512548, 0.0880827,
  ];
  const T = 929.62593;
  const c = 64.23399;
  let sum = 0;

  for (let n = 1; n <= A.length; n++) {
    sum += A[n - 1] * Math.cos((2 * Math.PI * n * x1) / T);
  }

  return sum + c;
}
const scaling_values = {
  "Accounting": [57.49, 13.2],
  "Ancient History": [62.2, 14.3],
  "Animal Production Systems": [47.1, 14.0],
  "Applied Information Technology": [52.5, 14.4],
  "Arabic": [59.2, 12.5],
  "Auslan": [65.1, 6.5],
  "Aviation": [55.8, 11.5],
  "Bengali": [57.4, 12.9],
  "Biology": [57.4, 12.9],
  "Bosnian": [54.7, 13.3],
  "Business Management and Enterprise": [56.0, 12.4],
  "Career and Enterprise": [63.2, 13.1],
  "Chemistry": [56.8, 12.0],
  "Children; Family and the Community": [59.6, 11.1],
  "Chinese: Background Language": [50.5, 17.7],
  "Chinese: First Language": [70.0, 13.6],
  "Chinese: Second Language": [57.7, 13.5],
  "Computer Science": [58.6, 14.6],
  "Croatian": [58.6, 14.6],
  "Dance": [55.8, 13.4],
  "Design": [58.3, 13.6],
  "Dutch": [55.5, 12.8],
  "Earth and Environmental Science": [59.5, 13.3],
  "Economics": [56.9, 12.8],
  "Engineering Studies": [57.3, 13.3],
  "English": [53.7, 14.4],
  "English as an Additional Language or Dialect": [56.2, 12.6],
  "Filipino": [56.2, 12.6],
  "Food Science and Technology": [66.2, 15.6],
  "French: Background Language": [68.1, 13.0],
  "French: Second Language": [54.9, 13.1],
  "Geography": [62.2, 12.3],
  "German: Background Language": [63.1, 11.9],
  "German: Second Language": [53.6, 13.5],
  "Health Studies": [57.7, 11.3],
  "Hebrew": [66.5, 13.7],
  "Hindi: Background Language": [58.9, 13.1],
  "Human Biology": [58.9, 13.1],
  "Hungarian": [57.4, 10.2],
  "Indonesian: First Language": [60.0, 16.7],
  "Indonesian: Second Language": [51.3, 14.0],
  "Integrated Science": [62.7, 13.4],
  "Italian: Background Language": [62.7, 13.4],
  "Italian: Second Language": [55.9, 16.9],
  "Japanese: Background Language": [67.2, 14.7],
  "Japanese: Second Language": [66.9, 14.2],
  "Karen": [47.0, 16.4],
  "Khmer": [66.0, 13.4],
  "Korean: Background Language": [47.0, 16.4],
  "Korean: Second Language": [66.0, 13.4],
  "Literature": [55.4, 12.3],
  "Macedonian": [54.6, 13.2],
  "Marine and Maritime Studies": [55.3, 13.1],
  "Materials Design and Technology": [55.3, 13.1],
  "Applications": [64.5, 13.2],
  "Methods": [68.9, 13.1],
  "Specialist": [55.3, 14.0],
  "Media Production and Analysis": [57.7, 13.8],
  "Modern Greek": [57.7, 13.8],
  "Modern History": [62.0, 13.5],
  "Music": [53.9, 12.6],
  "Outdoor Education": [55.4, 15.5],
  "Persian": [61.3, 13.1],
  "Philosophy and Ethics": [55.7, 13.1],
  "Physical Education Studies": [62.3, 13.3],
  "Physics": [45.6, 14.0],
  "Plant Production Systems": [61.6, 13.1],
  "Polish": [61.6, 13.1],
  "Politics and Law": [57.2, 13.3],
  "Portuguese": [59.1, 11.2],
  "Psychology": [60.7, 12.0],
  "Punjabi": [64.9, 9.3],
  "Religion and Life": [62.4, 10.6],
  "Romanian": [60.6, 11.1],
  "Russian": [61.2, 7.4],
  "Serbian": [55.7, 15.3],
  "Sinhala": [53.7, 18.6],
  "Spanish": [56.1, 14.4],
  "Swedish": [56.1, 14.4],
  "Tamil": [56.1, 14.4],
  "Turkish": [56.1, 14.4],
  "Vietnamese": [56.1, 14.4],
  "Visual Arts": [56.1, 14.4]
};

function loadScores() {
  console.log(localStorage.getItem("classScores"));
  return JSON.parse(localStorage.getItem("classScores") || '{"subjects": {}}');
}
function saveScores(scores) {
  localStorage.setItem("classScores", JSON.stringify(scores));
}

var scores = loadScores();

function setScore(subject, test, score, weighting) {
  const scores = loadScores();

  if (!scores.subjects[subject]) {
    scores.subjects[subject] = {};
  }

  scores.subjects[subject][test] = {
    Score: score,
    Weighting: weighting,
  };

  saveScores(scores);
  calcAvg();
  renderTables();
}

function deleteScore(subject, test) {
  const scores = loadScores();

  if (!scores.subjects[subject]) {
    scores.subjects[subject] = {};
  }

  delete scores.subjects[subject][test];
  saveScores(scores);
  calcAvg();
  renderTables();
}

function calcAvg() {
  const data = loadScores();
  const subjects = data.subjects;

  for (const subject in subjects) {
    const tests = subjects[subject];

    let weightedSum = 0;
    let totalWeight = 0;

    for (const test in tests) {
      // Skip non-test properties (e.g., previous "Average" field)
      if (typeof tests[test] !== "object" || tests[test] === null) continue;

      const score = parseFloat(tests[test].Score);
      const weight = parseFloat(tests[test].Weighting);

      if (!isNaN(score) && !isNaN(weight)) {
        weightedSum += score * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight > 0) {
      const average = weightedSum / totalWeight;
      subjects[subject]["Average"] = average;
    } else {
      // No valid tests found; remove or nullify Average
      delete subjects[subject]["Average"];
    }
  }

  saveScores(data);
}

function scaleScores() {
  const data = loadScores();
  const subjects = data.subjects;

  for (const subject in subjects) {
    const average = subjects[subject]["Average"];

    subjects[subject]["Scaled Score"] =
      (average - scaling_values[subject][0] / scaling_values[subject][1]) * 14 + 60;
  }

  saveScores(data);
}

function deleteSubject(subject) {
  const scores = loadScores();

  if (!scores.subjects[subject]) {
    scores.subjects[subject] = {};
    delete scores.subjects[subject];
  } else {
    delete scores.subjects[subject];
  }

  saveScores(scores);
  renderTables();
}

var subjects_scores_display = document.getElementById("subjects");

function renderTables() {
  calcAvg();
  scaleScores();
  const data = loadScores();
  const container = document.getElementById("tables");
  container.innerHTML = ""; // Clear previous tables if re-rendering

  const subjects = data.subjects;

  for (const subject in subjects) {
    const division = document.createElement("div");
    container.appendChild(division);
    // Create a header
    const title = document.createElement("h3");
    const average = document.createElement("p");
    const scaled = document.createElement("p");
    title.textContent = subject;
    average.textContent = "Average: " + subjects[subject]["Average"].toFixed(2);
    scaled.textContent =
      "Scaled Score: " + subjects[subject]["Scaled Score"].toFixed(2);
    division.appendChild(title);
    division.appendChild(average);
    division.appendChild(scaled);

    // Create the table
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["Name", "Score", "Weighting"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    const tests = subjects[subject];

    for (const test in tests) {
      const row = document.createElement("tr");

      if (test != "Average" && test != "Scaled Score") {
        const testName = document.createElement("td");
        testName.textContent = test;

        const score = document.createElement("td");
        score.textContent = tests[test].Score;

        const weight = document.createElement("td");
        weight.textContent = tests[test].Weighting;

        row.appendChild(testName);
        row.appendChild(score);
        row.appendChild(weight);

        tbody.appendChild(row);
      }
    }

    table.appendChild(tbody);
    division.appendChild(table);
  }
  var aggregate_display_p = document.getElementById("aggregate-display-p");
  var atar_display_p = document.getElementById("atar-display");
  console.log(calculate_aggregate());
  atar_display_p.textContent = calculate_ATAR(calculate_aggregate()).toFixed(2);
  aggregate_display_p.textContent = calculate_aggregate().toFixed(2);
}

renderTables();

var add_score_button = document.getElementById("add-score");
var add_score_subject = document.getElementById("cars");
var add_score_test_name = document.getElementById("test-name");
var add_score_test_score = document.getElementById("test-score");
var add_score_test_weighting = document.getElementById("test-weighting");

var delete_score_button = document.getElementById("delete-score");
var delete_subject_button = document.getElementById("delete-subject");

delete_subject_button.onclick = function () {
  deleteSubject(add_score_subject.value);
};

delete_score_button.onclick = function () {
  deleteScore(add_score_subject.value, add_score_test_name.value);
  renderTables();
};

add_score_button.onclick = function () {
  setScore(
    add_score_subject.value,
    add_score_test_name.value,
    add_score_test_score.value,
    add_score_test_weighting.value,
  );
  calcAvg();
  scaleScores();
  renderTables();
};

function calculate_aggregate() {
  const data = loadScores();
  const subjects = data.subjects;

  let total_aggregate = 0;
  let subject_count = 0;

  let weighted_averages = [];

  for (const subject in subjects) {
    weighted_averages.push(parseFloat(subjects[subject]["Scaled Score"]));
  }

  let top_four = weighted_averages.sort((a, b) => b - a).slice(0, 4);
  top_four.forEach((num) => {
    total_aggregate += num;
  });
  if (subjects["Specialist"]) {
    total_aggregate += subjects["Specialist"]["Scaled Score"] * 0.1;
  }
  if (subjects["Methods"]) {
    total_aggregate += subjects["Methods"]["Scaled Score"] * 0.1;
  }
  if (subjects["Japanese"]) {
    total_aggregate += subjects["Japanese"]["Scaled Score"] * 0.1;
  }
  if (subjects["German"]) {
    total_aggregate += subjects["German"]["Scaled Score"] * 0.1;
  }

  return total_aggregate;
}

document.getElementById("atar-display-button").onclick = function () {
  renderTables();
};

document.getElementById("atar-display-button").click();
