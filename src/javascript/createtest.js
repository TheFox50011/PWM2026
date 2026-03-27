document.addEventListener('DOMContentLoaded', () => {


    document.body.addEventListener('click', function(event) {

        const addOptionBtn = event.target.closest('.add-text-btn');
        if (addOptionBtn) {
            const questionCard = addOptionBtn.closest('.question-card');
            const newOption = document.createElement('div');
            newOption.className = 'option-row';
            newOption.innerHTML = `
                <span class="circle-bullet"></span>
                <input type="text" class="input-pill" placeholder="Escribe una nueva opción">
                <span class="icon-btn" title="Incorrecto" onclick="toggleCorrect(this)">&#9744;</span>
            `;
            questionCard.insertBefore(newOption, addOptionBtn);
        }
        const addQuestionBtn = event.target.closest('.sidebar-add-btn');
        if (addQuestionBtn) {
            const leftColumn = document.querySelector('.left-column');
            const questionCount = document.querySelectorAll('.question-card').length + 1;
            const newQuestionCard = document.createElement('div');
            newQuestionCard.className = 'question-card';

            newQuestionCard.style.marginTop = '30px';

            newQuestionCard.innerHTML = `
                <label class="card-label">Question ${questionCount}</label>
                <input type="text" class="input-pill" placeholder="Escribe tu pregunta aquí">

                <label class="card-label">Options</label>

                <div class="option-row">
                    <span class="circle-bullet"></span>
                    <input type="text" class="input-pill" placeholder="Opción 1">
                    <span class="icon-btn" title="Correcto" onclick="toggleCorrect(this)">&#9745;</span>
                </div>

                <div class="option-row">
                    <span class="circle-bullet"></span>
                    <input type="text" class="input-pill" placeholder="Opción 2">
                    <span class="icon-btn" title="Incorrecto" onclick="toggleCorrect(this)">&#9744;</span>
                </div>

                <div class="add-text-btn">
                    <strong class="plus-symbol">+</strong>
                    <span>Add options</span>
                </div>
            `;
            leftColumn.appendChild(newQuestionCard);
            const sidebarCard = document.querySelector('.sidebar-card');
            const newSidebarItem = document.createElement('div');
            newSidebarItem.className = 'question-item';
            newSidebarItem.innerHTML = `
                <span>Question ${questionCount}</span>
                <div class="question-actions">
                    <span class="action-icon" title="Eliminar">&#128465;</span>
                </div>
            `;

            sidebarCard.insertBefore(newSidebarItem, addQuestionBtn);
        }

        const deleteBtn = event.target.closest('span[title="Eliminar"]');
        if (deleteBtn) {
            const sidebarItem = deleteBtn.closest('.question-item');
            const allSidebarItems = Array.from(document.querySelectorAll('.question-item'));
            const questionIndex = allSidebarItems.indexOf(sidebarItem);

            if (questionIndex !== -1) {
                const allQuestionCards = document.querySelectorAll('.question-card');
                if (allQuestionCards[questionIndex]) {
                    allQuestionCards[questionIndex].remove();
                }
                sidebarItem.remove();

                const remainingCards = document.querySelectorAll('.question-card');
                const remainingSidebarItems = document.querySelectorAll('.question-item');

                remainingCards.forEach((card, index) => {
                    const titleLabel = card.querySelector('.card-label');
                    if (titleLabel) titleLabel.textContent = `Question ${index + 1}`;
                });

                remainingSidebarItems.forEach((item, index) => {
                    const titleSpan = item.querySelector('span');
                    if (titleSpan) titleSpan.textContent = `Question ${index + 1}`;
                });
            }
        }
    });
});
window.toggleCorrect = function(element) {
    if (element.innerHTML.charCodeAt(0) === 9745 || element.innerHTML === '☑') {
        element.innerHTML = '&#9744;';
        element.title = 'Incorrecto';
    } else {
        element.innerHTML = '&#9745;';
        element.title = 'Correcto';
    }
};