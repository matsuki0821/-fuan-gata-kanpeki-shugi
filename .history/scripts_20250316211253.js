document.addEventListener('DOMContentLoaded', function() {
    // グローバル変数として定義
    let slideIndex = 1;
    
    // スライドを表示する関数 - 透明度でアニメーション
    function showSlides(n) {
        let slides = document.getElementsByClassName("slide");
        let dots = document.getElementsByClassName("dot");
        
        if (!slides.length || !dots.length) return;
        
        if (n > slides.length) {slideIndex = 1}    
        if (n < 1) {slideIndex = slides.length}
        
        // すべてのスライドを非表示に（透明度で制御）
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.opacity = "0";
            slides[i].style.zIndex = "0";
            slides[i].style.transition = "opacity 0.5s ease";
        }
        
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active-dot", "");
        }
        
        // 現在のスライドを表示
        slides[slideIndex-1].style.opacity = "1";
        slides[slideIndex-1].style.zIndex = "1";
        dots[slideIndex-1].className += " active-dot";
    }
    
    // グローバルスコープに関数を配置
    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    };
    
    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    };
    
    // 初期表示の設定
    showSlides(slideIndex);
    
    // 最初に全てのスライドの表示スタイルを設定
    const slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
        slides[i].style.zIndex = "0";
        slides[i].style.position = "absolute";
        slides[i].style.width = "100%";
        slides[i].style.height = "100%";
        slides[i].style.transition = "opacity 0.5s ease";
    }
    
    // 最初のスライドだけを表示
    if (slides.length > 0) {
        slides[0].style.opacity = "1";
        slides[0].style.zIndex = "1";
    }
    
    // 自動スライドショー
    let slideInterval = setInterval(function() {
        plusSlides(1);
    }, 5000); // 5秒ごとに切り替え
    
    // スライドショーの要素にマウスが乗ったらタイマーを停止
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', function() {
            slideInterval = setInterval(function() {
                plusSlides(1);
            }, 5000);
        });
    }
    
    // カリキュラムタブの処理
    const curriculumTabs = document.querySelectorAll('.curriculum-tab');
    const courseContent = document.getElementById('course-content');
    const examContent = document.getElementById('exam-content');
    
    if (curriculumTabs.length && courseContent && examContent) {
        curriculumTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // すべてのタブから active クラスを削除
                curriculumTabs.forEach(t => t.classList.remove('active'));
                
                // クリックされたタブに active クラスを追加
                this.classList.add('active');
                
                // ターゲットに基づいてコンテンツを表示/非表示
                if (this.dataset.target === 'course') {
                    courseContent.style.display = 'block';
                    examContent.style.display = 'none';
                } else {
                    courseContent.style.display = 'none';
                    examContent.style.display = 'block';
                }
            });
        });
    }
    
    // ハンバーガーメニュー
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('show');
        });
    }
    
    // FAQ アコーディオン
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
    
    // フォーム送信処理
    const applicationForm = document.getElementById('application-form');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // reCAPTCHAの検証
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                alert('reCAPTCHAにチェックを入れてください。');
                return;
            }
            
            // フォームデータの取得
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // ここにフォーム送信のAjaxコードを追加
            // 例: fetch('/submit-form', { method: 'POST', body: formData })
            
            // 実際の送信処理の代わりにアラートを表示（デモ用）
            alert('お申し込みありがとうございます！担当者より折り返しご連絡いたします。');
            
            // フォームをリセット
            applicationForm.reset();
            grecaptcha.reset();
        });
    }
    
    // スムーススクロール
    const navLinks = document.querySelectorAll('nav a, .btn[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // ハッシュがある場合のみ処理
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // ハンバーガーメニューが開いている場合は閉じる
                    if (menu && menu.classList.contains('show')) {
                        menu.classList.remove('show');
                    }
                    
                    // ヘッダーの高さを考慮したスクロール位置の計算
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    // スムーススクロール
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // スクロール時のヘッダースタイル変更
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // FAQ の最初の項目を開いておく
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
});