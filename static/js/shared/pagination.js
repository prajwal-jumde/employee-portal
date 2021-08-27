var currentPage;
var lastPage;
var pageOpt1;
var pageOpt2;
var pageOpt3;
var totalRecords;
var pageNumArr;
var pageLimit = 10;

$(document).ready(function () {
  resetPagination()
  setPageOffset(currentPage);

  $("#totalRecords").change(function () {
    updateAfterTotal();
  });
});

function resetPagination() {
  currentPage = 1;
  updateAfterTotal();
  checkPagePresence();
}

function updateAfterTotal() {
  totalRecords = parseInt($("#totalRecords").val(), 10);
  if (totalRecords == 0 || isNaN(totalRecords)) {
    $("#tableFooter").addClass("hide")
  } else if (totalRecords !== undefined) {
    $("#tableFooter").removeClass("hide")
    pageNumArr = [];
    lastPage = Math.ceil(totalRecords / pageLimit);
    for (let index = 1; index <= lastPage; index++) {
      pageNumArr.push(index);
    }

    if (currentPage == 1) {

      setActive(1);
      $("#pgnOpt1").html(1);
      $("#pgnOpt2").html(2);
      $("#pgnOpt3").html(3);

      if (pageNumArr.length >= 1) {
        setPresence(1);
      }

      if (pageNumArr.length >= 2) {
        setPresence(2);
      }

      if (pageNumArr.length >= 3) {
        setPresence(3);
      }
    }
    checkPagePresence();
  }
}

function goToPrevious() {
  if (currentPage > 3) {
    $("#pgnOpt1").html(parseInt($("#pgnOpt1").html(), 10) - 3);
    $("#pgnOpt2").html(parseInt($("#pgnOpt2").html(), 10) - 3);
    $("#pgnOpt3").html(parseInt($("#pgnOpt3").html(), 10) - 3);
    setPresence(3);

    routeToOptionThree();
  }
}

function goToFirst() {
  if (currentPage !== 1) {
    if (currentPage === 2 || currentPage === 3) {
      routeToOptionOne();
    } else {
      $("#pgnOpt1").html(1);
      $("#pgnOpt2").html(2);
      $("#pgnOpt3").html(3);
      setPresence(3);
      routeToOptionOne();
    }
  }
}

function routeToOptionOne() {
  setActive(1);
  currentPage = parseInt($("#pgnOpt1").html(), 10);
  checkPagePresence();
  setPageOffset(currentPage);
}

function routeToOptionTwo() {
  setActive(2);
  currentPage = parseInt($("#pgnOpt2").html(), 10);
  checkPagePresence();
  setPageOffset(currentPage);
}

function routeToOptionThree() {
  setActive(3);
  currentPage = parseInt($("#pgnOpt3").html(), 10);
  checkPagePresence();
  setPageOffset(currentPage);
}

// Route to next page section
function goToNext() {
  const lastPageSection = Math.ceil(lastPage / 3);
  const currentPageSection = Math.ceil(currentPage / 3);

  pageOption1 = parseInt($("#pgnOpt1").html(), 10);
  pageOption2 = parseInt($("#pgnOpt2").html(), 10);
  pageOption3 = parseInt($("#pgnOpt3").html(), 10);

  // Check if current page section in less than last page section
  if (currentPageSection < lastPageSection) {
    if (pageNumArr[pageOption1 + 2]) {
      isPresentPageOption1 = true;
      $("#pgnOpt1").removeClass("hide");
    } else {
      isPresentPageOption1 = false;
      $("#pgnOpt1").addClass("hide");
    }

    if (pageNumArr[pageOption2 + 2]) {
      isPresentPageOption2 = true;
      $("#pgnOpt2").removeClass("hide");
    } else {
      isPresentPageOption2 = false;
      $("#pgnOpt2").addClass("hide");
    }

    if (pageNumArr[pageOption3 + 2]) {
      isPresentPageOption3 = true;
      $("#pgnOpt3").removeClass("hide");
    } else {
      isPresentPageOption3 = false;
      $("#pgnOpt3").addClass("hide");
    }

   
    $("#pgnOpt1").html(pageOption1 + 3);
    $("#pgnOpt2").html(pageOption2 + 3);
    $("#pgnOpt3").html(pageOption3 + 3);

    routeToOptionOne();
  }
}

function goToLast() {
  if (lastPage % 3 === 1) {
    $("#pgnOpt1").html(lastPage);
    $("#pgnOpt2").html(lastPage + 1);
    $("#pgnOpt3").html(lastPage + 2);

    setActive(1);
    setPresence(1);
  }
  if (lastPage % 3 === 2) {
    $("#pgnOpt1").html(lastPage - 1);
    $("#pgnOpt2").html(lastPage);
    $("#pgnOpt3").html(lastPage + 1);

    setActive(2);
    setPresence(2);
  }
  if (lastPage % 3 === 0) {
    $("#pgnOpt1").html(lastPage - 2);
    $("#pgnOpt2").html(lastPage - 1);
    $("#pgnOpt3").html(lastPage);

    setActive(3);
    setPresence(3);
  }

  currentPage = lastPage;
  checkPagePresence();
  setPageOffset(currentPage);
}

function setActive(pgnOpt) {
  clearClass();
  if (pgnOpt == 1) {
    $("#pgnOpt1").addClass("pageActive");
    $("#pgnOpt2").addClass("pageInactive");
    $("#pgnOpt3").addClass("pageInactive");
  } else if (pgnOpt == 2) {
    $("#pgnOpt1").addClass("pageInactive");
    $("#pgnOpt2").addClass("pageActive");
    $("#pgnOpt3").addClass("pageInactive");
  } else if (pgnOpt == 3) {
    $("#pgnOpt1").addClass("pageInactive");
    $("#pgnOpt2").addClass("pageInactive");
    $("#pgnOpt3").addClass("pageActive");
  }
}

function clearClass() {
  $("#pgnOpt1").removeClass("pageActive pageInactive");
  $("#pgnOpt2").removeClass("pageActive pageInactive");
  $("#pgnOpt3").removeClass("pageActive pageInactive");
}

function setPresence(pgnOpt) {
  if (pgnOpt == 1) {
    $("#pgnOpt1").removeClass("hide");
    $("#pgnOpt2").addClass("hide");
    $("#pgnOpt3").addClass("hide");
  } else if (pgnOpt == 2) {
    $("#pgnOpt1").removeClass("hide");
    $("#pgnOpt2").removeClass("hide");
    $("#pgnOpt3").addClass("hide");
  } else if (pgnOpt == 3) {
    $("#pgnOpt1").removeClass("hide");
    $("#pgnOpt2").removeClass("hide");
    $("#pgnOpt3").removeClass("hide");
  }
}

function checkPagePresence() {
  // Handling presence of first, previous, next and last
  if (currentPage == 1) {
    $("#pgnFirst").addClass("hide");
  } else {
    $("#pgnFirst").removeClass("hide");
  }
  if (currentPage <= 3) {
    $("#pgnPrevious").addClass("hide");
  } else {
    $("#pgnPrevious").removeClass("hide");
  }
  const lastPageSection = Math.ceil(lastPage / 3);
  const currentPageSection = Math.ceil(currentPage / 3);

  // Check if current page section is equal to last page section
  if (currentPageSection == lastPageSection) {
    $("#pgnNext").addClass("hide");
  } else {
    $("#pgnNext").removeClass("hide");
  }
  if (currentPage == lastPage) {
    $("#pgnLast").addClass("hide");
  } else {
    $("#pgnLast").removeClass("hide");
  }

  // For displaying page num
  $("#firstRecordNum").html(currentPage * pageLimit - pageLimit + 1);
  lastRecordNum = currentPage * pageLimit;
  if (lastRecordNum > totalRecords) {
    lastRecordNum = totalRecords;
  }
  $("#lastRecordNum").html(lastRecordNum);
  $("#totalRecordNum").html(totalRecords);
}
