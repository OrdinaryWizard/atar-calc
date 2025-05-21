var show_add_score_menu = document.getElementById("add-test-score-show");
var add_score_menu = document.getElementById("add-test-score");
var close_add_score_menu = document.getElementById("close-add-score-menu");

show_add_score_menu.onclick = function () {
    if (add_score_menu.style.display == 'none') {
        add_score_menu.style.display = 'block';
    } else {
        add_score_menu.style.display = 'none';
    }
}
close_add_score_menu.onclick = function () {
    add_score_menu.style.display = 'none';
}