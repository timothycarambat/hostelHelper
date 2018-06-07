function modalText(title) {
  return `
  <div id="HostelHelper" class="reveal-modal small open" data-reveal="" style="display: block; opacity: 1; visibility: visible; top: 100px;">                    <link rel="stylesheet" href="//icd.hwstatic.com/static/styles/cdn/3.62.3.0/__secure__empty_deployed.css" type="text/css">

    <div class="modal_overflow">
        <h2>Hostel Helper &#128526;</h2>
        <p>${title}</p>
        <div class="loginForm" id='helperInfo'>
          <ul style='list-style:none'>
            <li class='hidden' id='reviewCountStatus'> Getting Review Count <i class=' fa fa-cog fa-spin'></i> </li>
            <li class='hidden' id='combineReviews'> Getting Review Count <i class=' fa fa-cog fa-spin'></i> </li>
            <li class='hidden' id='averageAge'> Calculating Average Age <i class=' fa fa-cog fa-spin'></i> </li>
            <li class='hidden' id='genderRatio'> Calculating Gender Ratio <i class=' fa fa-cog fa-spin'></i> </li>
          </ul>


        </div>
    </div>

    <div class="loginForm">
      <p> Like this extension? Want to contribute to the repo? Email the <a href='mailto: rambat1010@gmail.com'> Author</a> </p>
    </div>
    <a class="close-reveal-modal">×</a>
</div>`
}
function makeModal(){
  var title = $('title').text().split('-')[0].trim();
  $('body').append(modalText(title));
}
