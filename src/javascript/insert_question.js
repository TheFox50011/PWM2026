function insert_question(test_id, question_number) {
    fetch("../assets/tests.json")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((test) => {
                if (test.test_id === test_id) {
                    test.questions.forEach((question) => {
                        if (question.question_id === question_number) {
                            document.getElementsByClassName("question-text")[0].innerHTML = question.Question_title;
                            for (let i=0; i<question.Options.length; i++) {
                                document.getElementById("ans"+(i+1)+"_label").innerHTML=question.Options[i].Option_name
                            }
                            for (let i=question.Options.length; i<4;i++) {
                                document.getElementById("option"+(i+1)).style.display="none";

                            }
                        }
                    })
                }
            })
        })

}