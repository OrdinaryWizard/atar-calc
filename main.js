function calculate_ATAR(TEA) {
  return (-2.7635438e-48) * (TEA ** 20) +
  (6.9433012e-45) * (TEA ** 19) +
  (-6.2752476e-42) * (TEA ** 18) +
  (2.3289491e-39) * (TEA ** 17) +
  (-3.5760048e-37) * (TEA ** 16) +
  (1.4556192e-34) * (TEA ** 15) +
  (-2.2232809e-32) * (TEA ** 14) +
  (-4.7165891e-29) * (TEA ** 13) +
  (8.4804129e-27) * (TEA ** 12) +
  (5.2754546e-24) * (TEA ** 11) +
  (-2.0604966e-21) * (TEA ** 10) +
  (3.5652122e-18) * (TEA ** 9) +
  (-2.839338e-15) * (TEA ** 8) +
  (7.12259e-13) * (TEA ** 7) +
  (3.3645452e-11) * (TEA ** 6) +
  (-2.4261277e-8) * (TEA ** 5) +
  (-9.2526176e-6) * (TEA ** 4) +
  (0.0047034058) * (TEA ** 3) +
  (-0.70128584) * (TEA ** 2) +
  (36.658041) * TEA +
  0.79894925;
}

function loadScores() {
    console.log(localStorage.getItem('classScores'))
    return JSON.parse(localStorage.getItem('classScores') || '{"subjects": {}}');
}
function saveScores(scores) {
    localStorage.setItem('classScores', JSON.stringify(scores));
}

var scores = loadScores();

function setScore(subject, test, score, weighting) {
    const scores = loadScores();
  
    if (!scores.subjects[subject]) {
      scores.subjects[subject] = {};
    }
  
    scores.subjects[subject][test] = {
      Score: score,
      Weighting: weighting
    };
  
    saveScores(scores);
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
      if (typeof tests[test] !== 'object' || tests[test] === null) continue;

      const score = parseFloat(tests[test].Score);
      const weight = parseFloat(tests[test].Weighting);

      if (!isNaN(score) && !isNaN(weight)) {
        weightedSum += score * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight > 0) {
      const average = weightedSum / totalWeight;
      subjects[subject]['Average'] = average;
    } else {
      // No valid tests found; remove or nullify Average
      delete subjects[subject]['Average'];
    }
  }

  saveScores(data);
}



var subjects_scores_display = document.getElementById("subjects");

function renderTables() {
    const data = loadScores();
    const container = document.getElementById('tables');
    container.innerHTML = ''; // Clear previous tables if re-rendering
  
    const subjects = data.subjects;
  
    for (const subject in subjects) {
      // Create a header
      const title = document.createElement('h2');
      title.textContent = subject + " - " + subjects[subject]["Average"];
      container.appendChild(title);
  
      // Create the table
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      ['Name', 'Score', 'Weighting'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
      });
  
      thead.appendChild(headerRow);
      table.appendChild(thead);
  
      // Create table body
      const tbody = document.createElement('tbody');
      const tests = subjects[subject];
  
      for (const test in tests) {
        const row = document.createElement('tr');
  
        if (test != "Average") {
          const testName = document.createElement('td');
          testName.textContent = test;
    
          const score = document.createElement('td');
          score.textContent = tests[test].Score;
    
          const weight = document.createElement('td');
          weight.textContent = tests[test].Weighting;
  
          row.appendChild(testName);
          row.appendChild(score);
          row.appendChild(weight);
  
          tbody.appendChild(row);
        }
      }
  
      table.appendChild(tbody);
      container.appendChild(table);
    }
  }

calcAvg()
renderTables()

var add_score_button = document.getElementById("add-score");
var add_score_subject = document.getElementById("subject-name");
var add_score_test_name = document.getElementById("test-name");
var add_score_test_score = document.getElementById("test-score");
var add_score_test_weighting = document.getElementById("test-weighting");


add_score_button.onclick = function () {
  setScore(add_score_subject.value, add_score_test_name.value, add_score_test_score.value, add_score_test_weighting.value);
}

function calculate_aggregate() {
  const data = loadScores();
  const subjects = data.subjects;

  let total_aggregate = 0;
  let subject_count = 0;

  let weighted_averages = [];

  for (const subject in subjects) {
    const tests = subjects[subject];

    let test_score_weighted_sum = 0;
    let test_score_weights_sum = 0;

    for (const test in tests) {
      let test_score = parseFloat(tests[test].Score);
      let test_weight = parseFloat(tests[test].Weighting);

      test_score_weighted_sum += test_score * test_weight;
      test_score_weights_sum += test_weight;
    }

    if (test_score_weights_sum > 0) {
      const subject_average = test_score_weighted_sum / test_score_weights_sum;
      weighted_averages.push(subject_average);
    }
    subject_count++;
  }

  let top_four = weighted_averages.sort((a,b) => b-a).slice(0, 4);
  top_four.forEach( num => {
    total_aggregate += num;
  })

  return subject_count > 0 ? total_aggregate : 0;
}


document.getElementById("atar-display-button").onclick = function () {
  var aggregate_display_p = document.getElementById("aggregate-display-p");
  var atar_display_p = document.getElementById("atar-display");
  console.log(calculate_aggregate())
  atar_display_p.textContent = calculate_ATAR(calculate_aggregate()).toFixed(2);
  aggregate_display_p.textContent = calculate_aggregate().toFixed(2);
}
