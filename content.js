

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      summarizer();
    }
  }
);

function summarizer() {
  makeModal();
  var propID = window.location.pathname.split('/').reverse()[0];
  var {reviewCount, pageCount} = getReviewCount(propID);
  const REVIEWERS = getAllReviews(propID, pageCount);
  var averageAge = calcAverageAge(REVIEWERS);
  var {males,females,other} = calcGenderRatio(REVIEWERS);
}

function getReviewCount(propID){
  let results = {};
  let $reviewCountStatus = $('#reviewCountStatus');

  $reviewCountStatus.removeClass('hidden');
  $.ajax({
    type: "get",
    async: false,
    url: `https://www.hostelworld.com/properties/${propID}/reviews?sort=newest&page=1&monthCount=36`,
    success: function(res){
      results = {
        total: res.pagination.totalNumberOfItems,
        pageCount: res.pagination.numberOfPages,
      }
      $reviewCountStatus.html(`<i style='color:#3c763d' class='fa fa-check'></i> Reviews: <b>${results.total}</b>`);
    }
  });
  return results;
}

//this will ajax every page sequentially
function getAllReviews(propID, pageCount){
  var REVIEWS = [];
  var i;
  var $combineReviews = $('#combineReviews');

  $combineReviews.removeClass('hidden')
  for(i = 1; i <= pageCount;  i++) {
    $.ajax({
      type: "get",
      async: false,
      url: `https://www.hostelworld.com/properties/${propID}/reviews?sort=newest&page=${i}&monthCount=36`,
      success: function(res){
          REVIEWS.push(res.reviews)
      }
    });
  }

  $combineReviews.html(`<i style='color:#3c763d' class='fa fa-check'></i> Combined <b>${pageCount}</b> Pages of Reviews`);
  //flatten array of arrays
  return [].concat.apply([],REVIEWS)
}

function calcAverageAge(REVIEWERS) {
  var $averageAge = $('#averageAge');
  var averageAge = 0;
  var reviewCount = REVIEWERS.length;

  $averageAge.removeClass('hidden')
  REVIEWERS.forEach(function(reviewer,i){
    let person = reviewer.reviewer
    let age = person.ageGroup.includes('-') ?
      //if range ex 18-24 then parse and get average
      person.ageGroup.split('-').reduce(function(a,b){return +a+(+b)})/2 :
      //other opts like 40+ just ParseInt()
      parseInt(person.ageGroup)

    averageAge += age
    $averageAge.html(`Average Age ${Math.round(averageAge/reviewCount)} (<i>running</i>)`);
  })

  $averageAge.html(`<i style='color:#3c763d' class='fa fa-check'></i>Average Age: <b>${Math.round(averageAge/reviewCount)}</b>`);
  return Math.round(averageAge/reviewCount)
}

function calcGenderRatio(REVIEWERS) {
  var $genderRatio = $('#genderRatio');
  var {males, females, other} = {males:0, females:0, other:0};
  var reviewCount = REVIEWERS.length;

  $genderRatio.removeClass('hidden');
  REVIEWERS.forEach(function(reviewer,i){
    let person = reviewer.reviewer
    let gender = person.gender.toLowerCase()
    if( gender === 'male') {
      males++
    }else if(gender === 'female'){
      females++
    }else{
      other++
    }
    $genderRatio.html(`Males${(males/reviewCount)*100} - Females{(females/reviewCount)*100} - Other{(other/reviewCount)*100} (<i>running</i>)`);
  })

  var highest = null;
  if( males > females && males > other) {
    highest = 'male'
  }else if (females > males && females > other) {
    highest = 'female'
  }else if (other > males && other > females) {
    highest = 'other'
  }

  $genderRatio.html(`
   <i style='color:#3c763d' class='fa fa-check'></i> Gender Distribution Calculated </br>
   <div style='margin-left: 17px; border-top: 1px solid whitesmoke; width: 181px;'>
     <p style='margin:0px; ${highest === 'male'? "font-weight:bold":"" }' >Males ${Math.round((males/reviewCount)*100)}%</p>
     <p style='margin:0px; ${highest === 'female'? "font-weight:bold":"" }' >Females ${Math.round((females/reviewCount)*100)}%</p>
     <p style='margin:0px; ${highest === 'other'? "font-weight:bold":"" }' >Other ${Math.round((other/reviewCount)*100)}%</p>
    </div>
   `);

  return {males:males, females:females, other:other}
}
