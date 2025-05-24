var show_add_score_menu = document.getElementById("add-test-score-show");
var add_score_menu = document.getElementById("add-test-score");

add_score_menu.style.display = 'none';

show_add_score_menu.onclick = function () {
    if (add_score_menu.style.display == 'none') {
        add_score_menu.style.display = 'block';
        show_add_score_menu.innerHTML = 'Close';
    } else {
        add_score_menu.style.display = 'none';
        show_add_score_menu.innerHTML = 'Add Score';
    }
}