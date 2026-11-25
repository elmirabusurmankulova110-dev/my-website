
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. MOBILE MENU
    // =====================================

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            nav.classList.toggle("is-open", !isOpen);

        });

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("is-open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    // =====================================
    // 2. SCROLL ANIMATIONS
    // =====================================

    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        currentObserver.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealItems.forEach(item => {
            observer.observe(item);
        });

    } else {

        revealItems.forEach(item => {
            item.classList.add("is-visible");
        });

    }


    // =====================================
    // 3. COURSE SELECTION
    // =====================================

    const courseSelect = document.getElementById("courseSelect");

    const courseButtons =
        document.querySelectorAll(".course-select");

    courseButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedCourse = button.dataset.course;

            if (courseSelect) {
                courseSelect.value = selectedCourse;
            }

            document.getElementById("application")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

            setTimeout(() => {

                courseSelect?.focus({
                    preventScroll: true
                });

            }, 500);

        });

    });


    // =====================================
    // 4. MONTH AND DAY SELECTOR
    // =====================================

    const monthSelect =
        document.getElementById("monthSelect");

    const daySelect =
        document.getElementById("daySelect");

    const monthNames = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь"
    ];

    if (monthSelect && daySelect) {

        const today = new Date();

        const firstMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        // Добавляем текущий и следующие 11 месяцев

        for (let i = 0; i < 12; i++) {

            const date = new Date(
                firstMonth.getFullYear(),
                firstMonth.getMonth() + i,
                1
            );

            const year = date.getFullYear();

            const month = String(
                date.getMonth() + 1
            ).padStart(2, "0");

            const option = document.createElement("option");

            option.value = `${year}-${month}`;

            option.textContent =
                `${monthNames[date.getMonth()]} ${year}`;

            monthSelect.appendChild(option);

        }


        // Обновляем дни выбранного месяца

        function populateDays() {

            daySelect.innerHTML =
                '<option value="">Выберите день</option>';

            if (!monthSelect.value) {

                daySelect.disabled = true;

                return;

            }

            const [year, month] =
                monthSelect.value.split("-").map(Number);

            const daysInMonth =
                new Date(year, month, 0).getDate();

            const isCurrentMonth =
                year === today.getFullYear() &&
                month === today.getMonth() + 1;

            const firstAvailableDay =
                isCurrentMonth ? today.getDate() : 1;


            for (
                let day = firstAvailableDay;
                day <= daysInMonth;
                day++
            ) {

                const option =
                    document.createElement("option");

                option.value = String(day);

                option.textContent = String(day);

                daySelect.appendChild(option);

            }

            daySelect.disabled = false;

        }

        monthSelect.addEventListener(
            "change",
            populateDays
        );

    }


    // =====================================
    // 5. FORM VALIDATION
    // =====================================

    const form =
        document.getElementById("applicationForm");

    const successMessage =
        document.getElementById("successMessage");

    const successText =
        document.getElementById("successText");


    // Вывод ошибок

    function setError(fieldId, message) {

        const error = document.querySelector(
            `[data-error-for="${fieldId}"]`
        );

        const field =
            document.getElementById(fieldId);

        if (error) {
            error.textContent = message;
        }

        if (field) {

            field.setAttribute(
                "aria-invalid",
                message ? "true" : "false"
            );

        }

    }


    // Очистка ошибок

    function clearErrors() {

        const fields = [
            "studentName",
            "studentPhone",
            "courseSelect",
            "monthSelect",
            "daySelect",
            "timeSelect"
        ];

        fields.forEach(id => {
            setError(id, "");
        });

    }


    // =====================================
    // 6. FORM SUBMISSION
    // =====================================

    if (form) {

        form.addEventListener("submit", event => {

            event.preventDefault();

            clearErrors();

            successMessage.hidden = true;


            // Получаем данные

            const name =
                document.getElementById("studentName")
                    .value.trim();

            const phone =
                document.getElementById("studentPhone")
                    .value.trim();

            const course =
                courseSelect.value;

            const month =
                monthSelect.value;

            const day =
                daySelect.value;

            const time =
                document.getElementById("timeSelect")
                    .value;


            let valid = true;


            // Проверка имени

            if (name.length < 2) {

                setError(
                    "studentName",
                    "Введите имя (не менее 2 символов)."
                );

                valid = false;

            }


            // Проверка телефона

            const digits = phone.replace(/\D/g, "");

            if (digits.length < 9 || digits.length > 15) {

                setError(
                    "studentPhone",
                    "Проверьте номер телефона."
                );

                valid = false;

            }


            // Проверка курса

            if (!course) {

                setError(
                    "courseSelect",
                    "Выберите направление обучения."
                );

                valid = false;

            }


            // Проверка месяца

            if (!month) {

                setError(
                    "monthSelect",
                    "Выберите месяц."
                );

                valid = false;

            }


            // Проверка дня

            if (!day) {

                setError(
                    "daySelect",
                    "Выберите день."
                );

                valid = false;

            }


            // Проверка времени

            if (!time) {

                setError(
                    "timeSelect",
                    "Выберите удобное время."
                );

                valid = false;

            }


            // Если есть ошибки

            if (!valid) {

                form.querySelector(
                    '[aria-invalid="true"]'
                )?.focus();

                return;

            }


            // =====================================
            // 7. SUCCESS NOTIFICATION
            // =====================================

            const [year, monthNumber] =
                month.split("-").map(Number);

            const formattedMonth =
                monthNames[monthNumber - 1];

            const formattedDate =
                `${Number(day)} ${formattedMonth} ${year}`;


            successText.textContent =
                `${name}, ваша заявка: ${course}. ` +
                `Желаемая дата — ${formattedDate}, ` +
                `время — ${time}. ` +
                `Контакт: ${phone}. ` +
                `Мы свяжемся с вами для подтверждения записи.`;


            successMessage.hidden = false;


            // Прокрутка к уведомлению

            successMessage.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });


            // Очищаем форму

            form.reset();

            daySelect.innerHTML =
                '<option value="">Сначала месяц</option>';

            daySelect.disabled = true;

        });

    }


    // =====================================
    // 8. CURRENT YEAR IN FOOTER
    // =====================================

    const yearElement =
        document.getElementById("currentYear");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }

});
