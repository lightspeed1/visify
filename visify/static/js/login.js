function visLogin() {
  /* Note that you do NOT have to do a document.getElementById anywhere in this exercise. Use the elements below */
  var myInput = document.getElementById("psw");
  var confirmMyInput = document.getElementById("cpsw");
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var symbol = document.getElementById("symbol"); 
  var length = document.getElementById("length");
  var match = document.getElementById("match");

  // When the user starts to type something inside the password field
  myInput.onload = function () {
    console.log("helllooo");

    /* TODO: Question 1.1: Starts here */
    var lowerCaseLetters = new RegExp("[a-z]"); // : Fill in the regular expression for lowerCaseLetters 
    var upperCaseLetters = new RegExp("[A-Z]"); // : Fill in the regular expression for upperCaseLetters
    var numbers = new RegExp("[0-9]"); // Fill in the regular expression for digits
    var symbols = new RegExp(/[\!\@\#\$\%\^\&\*\(\)\_\-\=\+\[\]\{\}\;\:\"\'\,\<\>\.\?\/\\\|]/); // Fill in the regular expression for symbols
    var minLength = 12; // : Change the minimum length to what what it needs to be in the question    /[!@#\$%\^\&*\)\(+=._-]/
    /* TODO: Question 1.1: Ends here */

    /* TODO: Question 1.2:  Starts here */
    /*
         - So first read up on classList.  
         - Perform a console.log(letter.classList) and check the array that you see. By default the first time, there should be just 1 element and it should be
         "invalid". "invalid" is a class that is present in login.css. 
         - Below, there are a bunch of if blocks and else blocks.
         - Each if block means that some successful condition is satisfied for our password condition. So the red cross need to be converted to a check mark.
         - Each else block stands for a failed condition, so the green check mark needs to be a red cross again.
         - All that you need to do is, in each of the blocks, fill in the correct classNames for the remove and the add methods.
         */

    console.log(letter.classList);
    // Validate lowercase letters
    if (myInput.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate capital letters
    if (myInput.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    if (myInput.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    // Validate symbols
    if (myInput.value.match(symbols)) {
      symbol.classList.remove("invalid");
      symbol.classList.add("valid");
    } else {
      symbol.classList.remove("valid");
      symbol.classList.add("invalid");
    }

    // Validate length
    if (myInput.value.length >= minLength) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
    /* TODO: Question 1.2:  Ends here */

    // Validate password and confirmPassword
    var passEqualsConfPass = false; // TODO: Change this to the condition that needs to be checked so that the text entered in password equals the text in confirm password
    if(myInput.value == confirmMyInput.value){
      passEqualsConfPass = true;
    }
    if (passEqualsConfPass){
      match.classList.remove("invalid");
      match.classList.add("valid");
    } else {
      match.classList.remove("valid");
      match.classList.add("invalid");
    }
  };;

  /* TODO Question 1.3: Starts here */
  confirmMyInput.onkeyup = function () {
  // Validate password and confirmPassword
  var passEqualsConfPass = false; // TODO: Change this to the condition that needs to be checked so that the text entered in password equals the text in confirm password
  if(myInput.value == confirmMyInput.value){ //checking to see if the password matchess
    passEqualsConfPass = true;
  }
  if (passEqualsConfPass){ 
    match.classList.remove("invalid");
    match.classList.add("valid");
  } else { 
    match.classList.remove("valid");
    match.classList.add("invalid");
  }
    /* TODO Question 1.3: Ends here */

    // Disable or Enable the button based on the elements in classList
    enableButton(letter, capital, number, length, symbol, match);
  };
}

/* TODO Question 1.4: Starts here */
function enableButton(letter, capital, number, length, symbol, match) {
  // TODO: Clear this function for students to implement
  var button = document.getElementById("my_submit_button");
  var condition = false; // TODO: Replace false with the correct condition
  if(letter.classList == "valid" && capital.classList == "valid" && number.classList == "valid" && length.classList == "valid" && symbol.classList == "valid" && match.classList == "valid"){
    condition = true;
    button.disabled = false;
  }else{
    button.disabled = true;
  }
}

function onClickFunction() {
  alert("Hey! I'm all green! Well done.");
}
