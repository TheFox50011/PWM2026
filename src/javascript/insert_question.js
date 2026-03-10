async function insert_question(test_id, question_number) {
    fetch("../assets/tests.json")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((test) => {
                if (test.test_id === test_id) {
                    test.questions.forEach((question) => {
                        if (question.question_id === question_number) {
                            document.querySelector('h2[class="question-text"]').innerHTML = question.Question_title;
                            for (let i=0; i<question.Options.length; i++) {
                                label_id= "ans" + (i+1) + "_label";
                                document.querySelector('label[id='+label_id+']').innerHTML=question.Options[i].Option_name;
                            }
                            for (let i=question.Options.length; i<4;i++) {
                                option_id= "option" + (i+1);
                                document.querySelector('div[id='+option_id+']').style.display="none";

                            }
                        }
                    })
                }
            })
        })

}