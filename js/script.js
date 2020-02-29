
//var
var top_heading = "https://newsapi.org/v2/top-headlines?country=in&apiKey=" + key;
var categorie = ["business", "sports", "health", "technology", "science", "entertainment"];
var categorie_url = "https://newsapi.org/v2/top-headlines?country=in&category=" + categorie[0] + "&apiKey=" + key;

//first time function calling
loadData(top_heading);

// checking screen device for navbar collapse
if (window.innerWidth < 576) {
    $("li a").attr("data-toggle", "collapse");
    $("li a").attr("data-target", "#nav");
}
else {
    $("li a").attr("data-toggle", "");
    $("li a").attr("data-target", "");
}

//set click event anchor tag

$("a").click(function (e) {
    $("a").removeClass("active");
    $(this).addClass("active");
    e.preventDefault();
    if ($(this).attr("id") == 'home')
        loadData(top_heading);
    else
        loadData("https://newsapi.org/v2/top-headlines?country=in&category=" + $(this).attr("id") + "&apiKey=" + key);
});
//for search 
$("#search").click(function () {
    q = $(".input-group input").val();
    loadData("https://newsapi.org/v2/everything?q=" + q + "&apikey=" + key);
});
// refresh btn code

$(".error .btn").click(function () {
    if ($("a .active").attr("id")) {
        loadData("https://newsapi.org/v2/top-headlines?country=in&category=" + $("a .active").attr("id") + "&apiKey=" + key);
    } else {
        loadData(top_heading);
    }
});

// registring service worker

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceworker.js').then(function () {
        console.log("Service worker registered");
    })
        .catch(function () {
            console.log("Service worker not registered");
        });
}

//function define
function loadData(paraUrl) {
    $(".loading").show();
    $(".error").hide();
    fetch(paraUrl).then(function (data) {
        data.json().then(function (d) {
            v = d;
            $(".news-container").empty();
            $(".loading").hide();
            for (i = 0; i < d.articles.length; i++) {
                title = d.articles[i].title;
                content = d.articles[i].content;
                description = d.articles[i].description;
                url = d.articles[i].url;
                publishDate = d.articles[i].publishedAt;
                img_url = d.articles[i].urlToImage;
                source = d.articles[i].source.name;
                if (title == null || description == null || img_url == null) {
                    continue;
                }
                cont = $(".news-container").html() + `<div class='news-card m-3'>
                        <div class='news-header'>
                        <div class='news-title text-bold p-1'>${title}</div>
                        </div>
                        <div class='news-body p-2'>
                        <div class='news-img'><img src='${img_url}' class='img-fluid'/></div>
                        <div class='news-text p-2 text-darks'>${description}</div>
                        </div>
                        <div class='news-footer text-right'>
                        <a class='btn btn-primary' href='${url}'> Read News</a>
                        </div>
                        </div>`;
                        $(".news-container").html(cont);
            }
        })
            .catch(function (e) {
                $(".loading").hide();
                $(".news-container").html("<h3>Data Not Found </h3>")
            })
    })
        .catch(function (e) {
            $(".loading").hide();
            $(".error").show();

        });
}