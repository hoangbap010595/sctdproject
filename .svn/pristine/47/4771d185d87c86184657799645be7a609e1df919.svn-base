$(document).ready(function () {
    $("#menu").kendoMenu({
        direction: "right"
    });

    $('a[href="#"]').on('click', function (e) {
        e.preventDefault();
    });
    $('#menu > li').on('mouseover', function (e) {
        $(this).find("ul:first").show();
        $(this).find('> a').addClass('active');
    }).on('mouseout', function (e) {
        $(this).find("ul:first").hide();
        $(this).find('> a').removeClass('active');
    });
    $('#menu li li').on('mouseover', function (e) {
        if ($(this).has('ul').length) {
            $(this).parent().addClass('expanded');
        }
        $('ul:first', this).parent().find('> a').addClass('active');
        $('ul:first', this).show();
    }).on('mouseout', function (e) {
        $(this).parent().removeClass('expanded');
        $('ul:first', this).parent().find('> a').removeClass('active');
        $('ul:first', this).hide();
    });
})

