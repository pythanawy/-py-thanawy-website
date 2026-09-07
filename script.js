const darkmodeButton = document.getElementById("darkmodebtn");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (darkmodeButton) {
    darkmodeButton.addEventListener("click", function () {
        const isDark = document.body.classList.toggle("dark");

        darkmodeButton.textContent = isDark
            ? "الوضع النهاري"
            : "الوضع الليلي";

        darkmodeButton.setAttribute(
            "aria-pressed",
            String(isDark)
        );
    });
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.textContent = isOpen ? "✕" : "☰";

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    document.querySelectorAll(".nav-links a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");

            menuToggle.textContent = "☰";

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}

const sliderTrack = document.getElementById("sliderTrack");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const sliderDots = document.getElementById("sliderDots");

let currentSlide = 0;
let autoSlide = null;

if (
    sliderTrack &&
    slides.length > 0 &&
    prevBtn &&
    nextBtn &&
    sliderDots
) {
    slides.forEach(function (_, index) {
        const dot = document.createElement("span");

        dot.classList.add("dot");

        if (index === 0) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", function () {
            currentSlide = index;
            updateSlider();
            restartAutoSlide();
        });

        sliderDots.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function updateSlider() {
        sliderTrack.style.transform =
            `translateX(-${currentSlide * 100}%)`;

        dots.forEach(function (dot, index) {
            dot.classList.toggle(
                "active",
                index === currentSlide
            );
        });
    }

    function nextSlide() {
        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        updateSlider();
    }

    function previousSlide() {
        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        updateSlider();
    }

    nextBtn.addEventListener("click", function () {
        nextSlide();
        restartAutoSlide();
    });

    prevBtn.addEventListener("click", function () {
        previousSlide();
        restartAutoSlide();
    });

    function startAutoSlide() {
        clearInterval(autoSlide);

        autoSlide = setInterval(function () {
            nextSlide();
        }, 4000);
    }

    function restartAutoSlide() {
        clearInterval(autoSlide);
        startAutoSlide();
    }

    startAutoSlide();

    sliderTrack.addEventListener("mouseenter", function () {
        clearInterval(autoSlide);
    });

    sliderTrack.addEventListener("mouseleave", function () {
        startAutoSlide();
    });
}

/* =========================================================================
   CHURCH BOT WIDGET
   ========================================================================= */
(function () {
    "use strict";

    const WELCOME_MESSAGE =
        "أهلاً بيك! أنا بوت كنيسة مار مرقس بشبرا. اسألني عن مواعيد القداسات، " +
        "الاعتراف، الأنشطة، أو أي حاجة عن الكنيسة.";

    const styleTag = document.createElement("style");
    styleTag.textContent = `
        .cb-launcher {
            position: fixed;
            bottom: 22px;
            left: 22px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--green);
            color: #fff;
            border: none;
            box-shadow: var(--shadow, 0 8px 25px rgba(0,0,0,0.15));
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            transition: transform 0.25s ease, background-color 0.3s ease;
        }
        .cb-launcher:hover {
            background-color: var(--red);
            transform: scale(1.07);
        }
        .cb-launcher svg { width: 28px; height: 28px; }
        .cb-launcher .cb-close-icon { display: none; }
        .cb-launcher.cb-open .cb-chat-icon { display: none; }
        .cb-launcher.cb-open .cb-close-icon { display: block; }

        .cb-badge {
            position: absolute;
            top: -3px;
            right: -3px;
            width: 14px;
            height: 14px;
            background-color: var(--red);
            border: 2px solid var(--page-bg, #fff);
            border-radius: 50%;
        }

        .cb-panel {
            position: fixed;
            bottom: 96px;
            left: 22px;
            width: 360px;
            max-width: calc(100vw - 32px);
            height: 500px;
            max-height: calc(100vh - 140px);
            background-color: var(--surface);
            border-radius: 18px;
            box-shadow: var(--shadow, 0 10px 30px rgba(0,0,0,0.15));
            border-top: 5px solid var(--green);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 2000;
            direction: rtl;
        }
        .cb-panel.cb-visible {
            display: flex;
            animation: cb-pop-in 0.2s ease;
        }
        @keyframes cb-pop-in {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .cb-header {
            background-color: var(--green);
            color: #fff;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }
        .cb-header-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            font-size: 15px;
        }
        .cb-header-title span.cb-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #4caf72;
            border: 1px solid rgba(255,255,255,0.6);
            flex-shrink: 0;
        }
        .cb-header-close {
            background: transparent;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            line-height: 1;
            padding: 4px 8px;
            border-radius: 6px;
        }
        .cb-header-close:hover {
            background-color: rgba(255,255,255,0.15);
        }

        .cb-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background-color: var(--page-bg);
        }

        .cb-msg {
            max-width: 84%;
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 14px;
            line-height: 1.7;
            word-wrap: break-word;
        }
        .cb-msg-bot {
            align-self: flex-start;
            background-color: var(--surface);
            color: var(--heading);
            border: 1px solid var(--border);
            border-bottom-left-radius: 4px;
        }
        .cb-msg-user {
            align-self: flex-end;
            background-color: var(--green);
            color: #fff;
            border-bottom-right-radius: 4px;
        }
        .cb-msg-error {
            align-self: flex-start;
            background-color: #fbeaea;
            color: var(--red);
            border: 1px solid var(--red);
        }

        .cb-typing {
            align-self: flex-start;
            display: flex;
            gap: 4px;
            padding: 12px 14px;
            background-color: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            border-bottom-left-radius: 4px;
        }
        .cb-typing span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--body-text);
            opacity: 0.5;
            animation: cb-bounce 1s infinite ease-in-out;
        }
        .cb-typing span:nth-child(2) { animation-delay: 0.15s; }
        .cb-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes cb-bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
            40% { transform: translateY(-4px); opacity: 1; }
        }

        .cb-input-row {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px;
            border-top: 1px solid var(--border);
            background-color: var(--surface);
            flex-shrink: 0;
        }
        .cb-input {
            flex: 1;
            border: 1px solid var(--border);
            background-color: var(--page-bg);
            color: var(--heading);
            border-radius: 999px;
            padding: 10px 16px;
            font-size: 14px;
            font-family: inherit;
            outline: none;
            direction: rtl;
        }
        .cb-input:focus {
            border-color: var(--green);
        }
        .cb-send {
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background-color: var(--green);
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease;
        }
        .cb-send:hover:not(:disabled) {
            background-color: var(--red);
        }
        .cb-send:disabled {
            opacity: 0.5;
            cursor: default;
        }
        .cb-send svg { width: 18px; height: 18px; }

        @media (max-width: 480px) {
            .cb-launcher { left: 16px; bottom: 16px; width: 54px; height: 54px; }
            .cb-panel {
                left: 10px;
                right: 10px;
                width: auto;
                bottom: 82px;
                height: calc(100vh - 120px);
            }
        }
    `;
    document.head.appendChild(styleTag);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <button class="cb-launcher" id="cbLauncher" aria-label="افتح شات بوت الكنيسة" aria-expanded="false">
            <span class="cb-badge" id="cbBadge"></span>
            <svg class="cb-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l3-3.3A8.5 8.5 0 1 1 21 11.5Z"/>
            </svg>
            <svg class="cb-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
        </button>

        <div class="cb-panel" id="cbPanel" role="dialog" aria-label="شات بوت الكنيسة">
            <div class="cb-header">
                <div class="cb-header-title">
                    <span class="cb-dot"></span>
                    بوت كنيسة مار مرقس
                </div>
                <button class="cb-header-close" id="cbClose" aria-label="إغلاق الشات">✕</button>
            </div>

            <div class="cb-messages" id="cbMessages"></div>

            <div class="cb-input-row">
                <input
                    type="text"
                    class="cb-input"
                    id="cbInput"
                    placeholder="اكتب سؤالك هنا..."
                    autocomplete="off"
                >
                <button class="cb-send" id="cbSend" aria-label="إرسال">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 12l16-8-6 8 6 8-16-8Z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper);

    const launcher = document.getElementById("cbLauncher");
    const badge = document.getElementById("cbBadge");
    const panel = document.getElementById("cbPanel");
    const closeBtn = document.getElementById("cbClose");
    const messagesEl = document.getElementById("cbMessages");
    const inputEl = document.getElementById("cbInput");
    const sendBtn = document.getElementById("cbSend");

    let opened = false;

    function addMessage(text, kind) {
        const bubble = document.createElement("div");
        bubble.className = "cb-msg " + (
            kind === "user" ? "cb-msg-user" :
            kind === "error" ? "cb-msg-error" : "cb-msg-bot"
        );
        bubble.textContent = text;
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return bubble;
    }

    function showTyping() {
        const typing = document.createElement("div");
        typing.className = "cb-typing";
        typing.id = "cbTypingIndicator";
        typing.innerHTML = "<span></span><span></span><span></span>";
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
        const typing = document.getElementById("cbTypingIndicator");
        if (typing) typing.remove();
    }

    /* Embedded Knowledge Base from St.Mark_chatbot-main/knowledge_base.md */
    const KNOWLEDGE_BASE_DATA = `
# كنيسة الشهيد العظيم مارمرقس بشبرا

## معلومات عامة
- الاسم: كنيسة الشهيد العظيم مارمرقس بشبرا
- الموقع: شارع كلوت بك / شبرا، القاهرة، مصر
- التبعية: الكنيسة القبطية الأرثوذكسية - بطريركية الأقباط الأرثوذكس
- شفيع الكنيسة: القديس مارمرقس الرسول، كاروز الديار المصرية والشهيد وكاتب إنجيل مرقس

---

## مواعيد القداسات الإلهية

### الأيام الثابتة أسبوعياً:

1. **قداس الأحد:**
   - القداس الأول (الباكر): 6:00 صباحاً - 8:00 صباحاً (مذبح مارمرقس)
   - القداس الثاني: 8:00 صباحاً - 10:30 صباحاً (المذبح الرئيسي)
   - قداس الشباب والطلبة: 8:30 صباحاً - 10:30 صباحاً (كنيسة العذراء بالدور العلوي)

2. **قداس الأربعاء:**
   - من 7:00 صباحاً - 9:30 صباحاً

3. **قداس الجمعة:**
   - القداس الأول: 6:30 صباحاً - 8:30 صباحاً
   - القداس الثاني: 8:30 صباحاً - 11:00 صباحاً (القداس الرئيسي للشعب)

4. **قداس السبت:**
   - من 7:00 صباحاً - 9:30 صباحاً (يعقبه مدارس الأحد)

5. **قداسات باقي الأيام (الاثنين، الثلاثاء، الخميس):**
   - في غير أيام الأصوام: قداس واحد من 7:00 صباحاً - 9:00 صباحاً
   - في الصوم الكبير وصوم يونان: قداسات متأخرة تقام من 12:00 ظهراً - 2:30 ظهراً ومن 1:00 ظهراً - 3:30 عصراً

*ملاحظة: المواعيد قد تتغير في الأعياد والمناسبات الكنسية الكبرى (عيد القيامة، عيد الميلاد، أسبوع الآلام).*

---

## العشيات والتسبحة

1. **عشية السبت:**
   - رفع بخور عشية: 6:00 مساءً - 7:00 مساءً
   - تسبحة نصف الليل: 7:00 مساءً - 9:00 مساءً

2. **عشية الأحد:**
   - رفع بخور عشية مع اجتماع الصلاة: 6:30 مساءً - 8:00 مساءً

3. **تسبحة كيهك (شهر كيهك):**
   - سهرات كيهك أسبوعية (كل جمعة مساءً حتى صباح السبت مع القداس)

---

## سر الاعتراف ومواعيد الآباء الكهنة

### الآباء الكهنة الموقرون بالكنيسة:

1. **القمص أنجيلوس:**
   - الاعتراف: الأحد والثلاثاء بعد العشية (من 7:00 م إلى 9:00 م)
   - المقابلات: بميعاد مسبق عبر السكرتارية

2. **القمص مرقس:**
   - الاعتراف: الجمعة صباحاً بعد القداس الثاني، والأربعاء من 6:00 م إلى 8:30 م

3. **القس بيشوي:**
   - الاعتراف: السبت بعد القداس، والخميس من 6:30 م إلى 9:00 م
   - مسؤول عن اجتماع الشباب

4. **القس يوحنا:**
   - الاعتراف: الاثنين والأربعاء مساءً من 6:00 م إلى 8:30 م
   - مسؤول عن خدمة افتقاد المرضى والمحتاجين

*تنبيه: يُفضل حجز ميعاد مسبق للاعتراف مع الأب الكاهن خصوصاً في فترات الأعياد والأصوام منعاً للتكدس.*

---

## الأنشطة والاجتماعات الأسبوعية

### الاجتماعات العامة والنوعية:

1. **مدارس الأحد (التربية الكنسية):**
   - موعد: كل جمعة من 11:30 صباحاً حتى 1:30 ظهراً (للمراحل: حضانة، ابتدائي، إعدادي)
   - السبت: من 10:00 صباحاً حتى 12:00 ظهراً (للمرحلة الثانوية)

2. **اجتماع الشباب والجامعيين:**
   - موعد: كل خميس الساعة 7:00 مساءً (بقاعة القديس أثناسيوس)
   - المحتوى: ترانيم، درس كتاب، كلمة روحية، مناقشات شبابية

3. **اجتماع درس الكتاب المقدس العام:**
   - موعد: كل ثلاثاء الساعة 7:00 مساءً بالكنيسة الرئيسية
   - يقدمه أحد الآباء الكهنة مع دراسة تفصيلية لأسفار العهدين القديم والجديد

4. **اجتماع الأسرة والشاريعين في الزواج:**
   - موعد: الأحد الأول والثالث من كل شهر الساعة 7:00 مساءً

5. **اجتماع الحرفيين والمهنيين:**
   - موعد: الاثنين الساعة 7:30 مساءً

6. **اجتماع كبار السن (المسنين والبركة):**
   - موعد: الأربعاء الساعة 10:00 صباحاً (يشمل قداساً مخصصاً يليه لقاء روحي وضيافة)

---

## الخدمات الاجتماعية والطبية التابعة للكنيسة

1. **المستوصف الخيري (المركز الطبي لمارمرقس):**
   - يقدم خدمات طبية بأسعار رمزية
   - العيادات المتاحة: باطنة، أطفال، عظام، أسنان، جلدية، رمد، نساء وتوليد
   - معمل تحاليل متكامل وصيدلية خيرية
   - مواعيد العمل: يومياً من 9:00 صباحاً - 1:00 ظهراً، ومن 5:00 مساءً - 9:00 مساءً (الجمعة عيادات مسائية فقط)

2. **مكتب التنمية والرعاية الاجتماعية:**
   - تقديم المساعدات للأسر المحتاجة وأخوة الرب
   - تجهيز العرائس ومساعدة الطلبة
   - المقابلات: الأحد والأربعاء من 6:00 م إلى 8:00 م

3. **حضانة الأطفال (مرحلة ما قبل المدرسة):**
   - تستقبل الأطفال من سن سنتين ونصف إلى 5 سنوات
   - من الأحد إلى الخميس، من 7:30 صباحاً حتى 2:30 ظهراً

4. **فصول التقوية التعليمية:**
   - لجميع المراحل الدراسية بأسعار رمزية لمساعدة أهالي المنطقة

---

## الكورسات والأنشطة الخاصة

- **كورسات المشورة للمقبلين على الزواج:**
  - دورات منتظمة معتمدة من المطرانية (شرط لإتمام الخطوبة والزواج الكنسي)
  - للاشتراك والاستعلام: من خلال مكتب السكرتارية

- **فصول تعليم الألحان القبطية واللغة القبطية:**
  - للأطفال والشعب: السبت من 5:00 م - 6:30 م

- **الكشافة والمرشدات:**
  - فرقة كشافة مارمرقس: تدريبات كل جمعة بعد مدارس الأحد
`;

    const SYSTEM_INSTRUCTIONS = `
أنت المساعد الذكي الرسمي لكنيسة الشهيد العظيم مارمرقس بشبرا.
مهمتك مساعدة شعب الكنيسة والزوار في الإجابة عن كل استفساراتهم بدقة ومحبة واحترام.
أسلوبك: ودود، محترم، واضح ومباشر، باللهجة المصرية المهذبة وبطابع كنسي قبطي أرثوذكسي مناسب.

قواعد الإجابة:
1. اعتمد فقط وبشكل كامل على المعلومات الموجودة في قاعدة المعرفة المرفقة أدناه.
2. لو السؤال عن حاجة أو تفاصيل مش موجودة في قاعدة المعرفة، اعتذر بذوق واطلب منه مراجعة مكتب السكرتارية بالكنيسة أو أحد الآباء الكهنة.
3. لا تخمن ولا تؤلف أي مواعيد، أسماء كهنة، أو تفاصيل من عندك إطلاقاً.
`;

    function normalizeArabic(text) {
        return text
            .toLowerCase()
            .replace(/[إأآا]/g, "ا")
            .replace(/[ىي]/g, "ي")
            .replace(/ة/g, "ه")
            .replace(/[ًٌٍَُِّْـ]/g, "")
            .trim();
    }

    function getLocalResponse(question) {
        const normalizedQuestion = normalizeArabic(question);
        const asksAboutConfession = /اعتراف|اعترافات/.test(normalizedQuestion);
        const asksAboutMass = /قداس|قداسات|مواعيد.*(قداس|كنيسه)|امتى.*(قداس|كنيسه)|متي.*(قداس|كنيسه)/.test(normalizedQuestion);

        if (asksAboutConfession && /بيشوي/.test(normalizedQuestion)) {
            return "مواعيد الاعتراف مع القس بيشوي:\n- السبت بعد القداس.\n- الخميس من 6:30 مساءً إلى 9:00 مساءً.\n\nيفضل التأكد من الكنيسة قبل الذهاب لأن المواعيد قد تتغير.";
        }

        if (asksAboutConfession && /مرقس/.test(normalizedQuestion)) {
            return "مواعيد الاعتراف مع القمص مرقس:\n- الجمعة صباحًا بعد القداس الثاني.\n- الأربعاء من 6:00 مساءً إلى 8:30 مساءً.\n\nيفضل التأكد من الكنيسة قبل الذهاب لأن المواعيد قد تتغير.";
        }

        if (asksAboutConfession) {
            return "مواعيد الاعتراف تختلف حسب الأب الكاهن. اكتب اسم الأب، مثل: القس بيشوي أو القمص مرقس، لأعرض لك الموعد المحدد.";
        }

        if (!asksAboutMass) return null;

        if (/احد/.test(normalizedQuestion)) {
            return "مواعيد قداسات يوم الأحد:\n- القداس الأول (الباكر): من 6:00 صباحًا إلى 8:00 صباحًا (مذبح مارمرقس).\n- القداس الثاني: من 8:00 صباحًا إلى 10:30 صباحًا (المذبح الرئيسي).\n- قداس الشباب والطلبة: من 8:30 صباحًا إلى 10:30 صباحًا (كنيسة العذراء بالدور العلوي).\n\nالمواعيد ممكن تتغير في الأعياد والمناسبات الكنسية الكبرى، فالأفضل التأكد من سكرتارية الكنيسة قبل الذهاب.";
        }

        return "دي مواعيد القداسات الأسبوعية حسب قاعدة بيانات الكنيسة:\n\n" +
            "الأحد:\n" +
            "- القداس الأول (الباكر): 6:00 ص - 8:00 ص (مذبح مارمرقس)\n" +
            "- القداس الثاني: 8:00 ص - 10:30 ص (المذبح الرئيسي)\n" +
            "- قداس الشباب والطلبة: 8:30 ص - 10:30 ص (كنيسة العذراء بالدور العلوي)\n\n" +
            "الأربعاء: 7:00 ص - 9:30 ص.\n" +
            "الجمعة: 6:30 ص - 8:30 ص، ثم 8:30 ص - 11:00 ص.\n" +
            "السبت: 7:00 ص - 9:30 ص، ويعقبه مدارس الأحد.\n" +
            "الاثنين والثلاثاء والخميس: 7:00 ص - 9:00 ص في غير أيام الأصوام.\n\n" +
            "المواعيد ممكن تتغير في الأعياد والمناسبات الكنسية الكبرى، فالأفضل التأكد من سكرتارية الكنيسة قبل الذهاب.";
    }

    async function sendQuestion() {
        const question = inputEl.value.trim();
        if (!question) return;

        addMessage(question, "user");
        inputEl.value = "";
        sendBtn.disabled = true;
        showTyping();

        try {
            const localResponse = getLocalResponse(question);

            if (localResponse) {
                hideTyping();
                addMessage(localResponse, "bot");
                return;
            }

            // Live Groq API key configured for the presentation demo
            const GROQ_API_KEY = "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";

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "allam-2-7b",
                    messages: [
                        {
                            role: "system",
                            content: `${SYSTEM_INSTRUCTIONS}\n\nقاعدة المعرفة:\n${KNOWLEDGE_BASE_DATA}`
                        },
                        { role: "user", content: question }
                    ]
                })
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error("Groq Error Details:", errorDetails);
                throw new Error("HTTP " + response.status);
            }

            const data = await response.json();
            hideTyping();

            const botReply = data.choices[0].message.content;
            addMessage(botReply || "معلش، مش لاقي إجابة دلوقتي.", "bot");

        } catch (error) {
            console.error(error);
            hideTyping();
            addMessage(
                "معلش، فيه مشكلة في الاتصال بالبوت دلوقتي. جرب تاني بعد شوية، أو كلّم مكتب الكنيسة مباشرة.",
                "error"
            );
        } finally {
            sendBtn.disabled = false;
        }
    }

    function togglePanel() {
        opened = !opened;
        launcher.classList.toggle("cb-open", opened);
        launcher.setAttribute("aria-expanded", String(opened));
        panel.classList.toggle("cb-visible", opened);

        if (opened) {
            badge.style.display = "none";
            if (messagesEl.children.length === 0) {
                addMessage(WELCOME_MESSAGE, "bot");
            }
            inputEl.focus();
        }
    }

    launcher.addEventListener("click", togglePanel);
    closeBtn.addEventListener("click", togglePanel);

    sendBtn.addEventListener("click", sendQuestion);
    inputEl.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendQuestion();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && opened) {
            togglePanel();
        }
    });
})();
