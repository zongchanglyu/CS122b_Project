let advanceSearch = $("#advance_search_form");

function handleSearchResult(resultDataString) {
    console.log(resultDataString);
    // let resultDataJson = JSON.parse(resultDataString);
    let resultDataJson = resultDataString;
    console.log("handle search response");
    console.log(resultDataJson);
    console.log(resultDataJson["status"]);
    // if (resultDataJson["status"] === "success") {
    //     window.location.replace("movie-list.html");
    // }
    window.location.replace("movie-list.html");

}

function handleSearchInfo(searchEvent) {
    console.log("submit search form");
    const url = "api/adv-search";
    console.log("api/adv-search");
    console.log(url);
    /**
     * When users click the submit button, the browser will not direct
     * users to the url defined in HTML form. Instead, it will call this
     * event handler when the event is triggered.
     */
    searchEvent.preventDefault();

    $.ajax("api/adv-search", {
        method: "GET",
        data: advanceSearch.serialize(),
        success: handleSearchResult
    });
}

advanceSearch.submit(handleSearchInfo);



// ==========================================================================
// handle autocomplete:
// ==========================================================================



/*
 * CS 122B Project 4. Autocomplete Example.
 *
 * This Javascript code uses this library: https://github.com/devbridge/jQuery-Autocomplete
 *
 * This example implements the basic features of the autocomplete search, features that are
 *   not implemented are mostly marked as "TODO" in the codebase as a suggestion of how to implement them.
 *
 * To read this code, start from the line "$('#autocomplete').autocomplete" and follow the callback functions.
 *
 */


/*
 * This function is called by the library when it needs to lookup a query.
 *
 * The parameter query is the query string.
 * The doneCallback is a callback function provided by the library, after you get the
 *   suggestion list from AJAX, you need to call this function to let the library know.
 */
function handleLookup(query, doneCallback) {
    console.log("autocomplete initiated")

    // TODO: if you want to check past query results first, you can do it here
    if(sessionStorage.getItem(query)!=null && sessionStorage.getItem(query).length!=0){
        var storagedData = JSON.parse(sessionStorage.getItem(query));
        doneCallback( { suggestions: storagedData } );
        console.log("Using Front-end cache results successfully! ")
        console.log(storagedData);
        console.log("The used suggestion list from Front-end cache: "+JSON.stringify(storagedData))
        return;
    }

    // sending the HTTP GET request to the Java Servlet endpoint hero-suggestion
    // with the query data
    console.log("Sending AJAX request to backend Java Servlet! ")
    jQuery.ajax({
        "method": "GET",
        // generate the request url from the query.
        // escape the query string to avoid errors caused by special characters
        "url": "autocomplete?query=" + escape(query),
        "success": function(data) {
            // pass the data, query, and doneCallback function into the success handler
            handleLookupAjaxSuccess(data, query, doneCallback)
        },
        "error": function(errorData) {
            console.log("lookup ajax error")
            console.log(errorData)
        }
    })
}


/*
 * This function is used to handle the ajax success callback function.
 * It is called by our own code upon the success of the AJAX request
 *
 * data is the JSON data string you get from your Java Servlet
 *
 */
function handleLookupAjaxSuccess(data, query, doneCallback) {
    // console.log("lookup ajax successful")

    // parse the string into JSON
    var jsonData = JSON.parse(data);
    console.log(jsonData);

    // for(let i=0; i<jsonData.length;i++){
    //     console.log("jsonData is: "+jsonData[i]["value"]);
    // }

    // TODO: if you want to cache the result into a global variable you can do it here
    // for(let i=0; i<jsonData.length;i++){
    //     // console.log("jsonData is: "+jsonData[i]["value"]);
    //     sessionStorage.setItem(query, JSON.stringify(jsonData[i]));
    //     console.log("sessionStorage is successful and data is: "+sessionStorage.getItem(query));
    // }
    sessionStorage.setItem(query, JSON.stringify(jsonData));
    // console.log("SessionStorage is successful! ")
    console.log("The used suggestion list from Back-end server: "+sessionStorage.getItem(query));

    // call the callback function provided by the autocomplete library
    // add "{suggestions: jsonData}" to satisfy the library response format according to
    //   the "Response Format" section in documentation
    doneCallback( { suggestions: jsonData } );
}


/*
 * This function is the select suggestion handler function.
 * When a suggestion is selected, this function is called by the library.
 *
 * You can redirect to the page you want using the suggestion data.
 */
function handleSelectSuggestion(suggestion) {
    // TODO: jump to the specific result page based on the selected suggestion

    console.log("you select " + suggestion["value"] + " with ID " + suggestion["data"]["movieId"])

    let movieId = suggestion["data"]["movieId"];
    window.location.replace("single-movie.html?id="+movieId);
}


/*
 * This statement binds the autocomplete library with the input box element and
 *   sets necessary parameters of the library.
 *
 * The library documentation can be find here:
 *   https://github.com/devbridge/jQuery-Autocomplete
 *   https://www.devbridge.com/sourcery/components/jquery-autocomplete/
 *
 */
// $('#autocomplete') is to find element by the ID "autocomplete"
$('#autocomplete').autocomplete({
    // documentation of the lookup function can be found under the "Custom lookup function" section
    lookup: function (query, doneCallback) {
        handleLookup(query, doneCallback)
    },
    onSelect: function(suggestion) {
        handleSelectSuggestion(suggestion)
    },
    // set delay time
    deferRequestBy: 300,
    // there are some other parameters that you might want to use to satisfy all the requirements
    // TODO: add other parameters, such as minimum characters
    minChars: 3,
});


/*
 * do normal full text search if no suggestion is selected
 */
function handleNormalSearch(query) {
    console.log("doing normal search with query: " + query);
    // TODO: you should do normal search here
    // console.log("submit search form");
    // const url = "api/adv-search";
    // console.log("api/adv-search");
    // console.log(url);
    // /**
    //  * When users click the submit button, the browser will not direct
    //  * users to the url defined in HTML form. Instead, it will call this
    //  * event handler when the event is triggered.
    //  */
    // searchEvent.preventDefault();
    //
    // $.ajax("api/adv-search", {
    //     method: "GET",
    //     data: advanceSearch.serialize(),
    //     success: handleSearchResult
    // });
}

// bind pressing enter key to a handler function
$('#autocomplete').keypress(function(event) {
    // keyCode 13 is the enter key
    if (event.keyCode == 13) {
        // pass the value of the input box to the handler function
        console.log("get keypress 13!")
        // handleNormalSearch($('#autocomplete').val())
    }
})

// TODO: if you have a "search" button, you may want to bind the onClick event as well of that button










