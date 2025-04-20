// モバイル対応の強化 - JavaScriptの改善

// ノッチの高さをCSS変数として設定
function setSafeAreaVariables() {
    if ('CSS' in window && CSS.supports('top: env(safe-area-inset-top)')) {
        // safe-area-inset をCSS変数として設定
        document.documentElement.style.setProperty(
            '--safe-area-inset-top',
            'env(safe-area-inset-top)'
        );
    } else {
        document.documentElement.style.setProperty('--safe-area-inset-top', '0px');
    }
}

// 読み込み時と画面サイズ変更時に実行
window.addEventListener('load', setSafeAreaVariables);
window.addEventListener('resize', setSafeAreaVariables);

document.addEventListener('DOMContentLoaded', function() {
    // スライドショー関連のグローバル変数と関数
    let slideIndex = 1;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // グローバルスコープに関数を公開
    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    };
    
    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    };
    
    // スライドを表示する関数
    function showSlides(n) {
        let slides = document.getElementsByClassName("slide");
        let dots = document.getElementsByClassName("dot");
        
        if (!slides.length || !dots.length) return;
        
        if (n > slides.length) {slideIndex = 1}    
        if (n < 1) {slideIndex = slides.length}
        
        // すべてのスライドを非表示
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active-dot", "");
        }
        
        // 現在のスライドを表示
        slides[slideIndex-1].style.display = "block";  
        dots[slideIndex-1].className += " active-dot";
    }
    
    // 初期表示
    showSlides(slideIndex);
    
    // スワイプ操作のサポート
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        slideshowContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }
    
    function handleSwipe() {
        // スワイプ距離が50px以上の場合にスライド切り替え
        if (touchEndX - touchStartX > 50) {
            // 右にスワイプ - 前のスライド
            window.plusSlides(-1);
        } else if (touchStartX - touchEndX > 50) {
            // 左にスワイプ - 次のスライド
            window.plusSlides(1);
        }
    }
    
    // 自動スライドショー用のタイマー設定
    let slideInterval = setInterval(function() {
        window.plusSlides(1);
    }, 5000);
    
    // スライドショーの要素にマウスやタッチが乗ったらタイマーを停止
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', function() {
            slideInterval = setInterval(function() {
                window.plusSlides(1);
            }, 5000);
        });
        
        slideshowContainer.addEventListener('touchstart', function() {
            clearInterval(slideInterval);
        }, {passive: true});
        
        slideshowContainer.addEventListener('touchend', function() {
            slideInterval = setInterval(function() {
                window.plusSlides(1);
            }, 5000);
        }, {passive: true});
    }
    
    // ハンバーガーメニューの改善
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const menuLinks = menu ? menu.querySelectorAll('a') : [];
    
    if (menuToggle && menu) {
        // ハンバーガーメニューのトグル
        menuToggle.addEventListener('click', function() {
            alert('Before toggle: ' + menu.className);

            menu.classList.toggle('show');
            alert(' After toggle: ' + menu.className);
            
            // アクセシビリティのため、aria属性も切り替え
            const isExpanded = menu.classList.contains('show');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            menu.setAttribute('aria-hidden', !isExpanded);
        });
        
        // メニューリンクをクリックしたらメニューを閉じる
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-hidden', 'true');
            });
        });
        
        // ページ外をクリックしたらメニューを閉じる
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('show')) {
                menu.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    // スムーススクロールの改善
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
const header = document.querySelector('header');
const safeAreaInsetTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0');
const headerHeight = header.offsetHeight;
const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - safeAreaInsetTop;
                    
                    // スムーススクロール
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // フォーカスを設定してアクセシビリティを向上
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({preventScroll: true});
                    
                    // URLにハッシュを更新
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
    
    // 画像の遅延読み込み
    const lazyImages = document.querySelectorAll('img.slide-image, .instructor-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // data-src属性がある場合は、それをsrc属性に設定
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.classList.remove('lazy-image');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        lazyImages.forEach(img => {
            // すでにsrc属性が設定されている場合は、それをdata-src属性に移動
            if (img.src && !img.dataset.src) {
                img.dataset.src = img.src;
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                img.classList.add('lazy-image');
            }
            
            imageObserver.observe(img);
        });
    } else {
        // IntersectionObserverが使えない場合は通常の読み込み
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
    
    // スクロール時のヘッダースタイル変更
    const header = document.querySelector('header');
    
    if (header) {
        // 初期状態の設定
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, {passive: true});
    }
    
    // タッチデバイスの検出
    function isTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    }
    
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }
    
    // FAQ アコーディオンの改善
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // アクセシビリティ属性の追加
            const id = `faq-answer-${index}`;
            answer.id = id;
            question.setAttribute('aria-expanded', item.classList.contains('active'));
            question.setAttribute('aria-controls', id);
            
            question.addEventListener('click', () => {
                const isActive = item.classList.toggle('active');
                question.setAttribute('aria-expanded', isActive);
                
                // スクリーンリーダー向けに状態を通知
                if (isActive) {
                    answer.style.display = 'block';
                } else {
                    answer.style.display = 'none';
                }
            });
        }
    });
    
    // 最初のFAQ項目を開いておく
    if (faqItems.length > 0) {
        const firstQuestion = faqItems[0].querySelector('.faq-question');
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        
        if (firstQuestion && firstAnswer) {
            faqItems[0].classList.add('active');
            firstQuestion.setAttribute('aria-expanded', 'true');
            firstAnswer.style.display = 'block';
        }
    }
    
    // フォーム送信処理の改善
    const applicationForm = document.getElementById('application-form');
    
    if (applicationForm) {
        // フォーム入力のバリデーション改善
        const formInputs = applicationForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            // 入力要素から判別
            if (input.hasAttribute('required')) {
                // 必須項目にラベルを追加
                input.addEventListener('invalid', function() {
                    if (input.value === '') {
                        input.setCustomValidity('このフィールドは必須です');
                    }
                });
                
                // カスタムメッセージをクリア
                input.addEventListener('input', function() {
                    input.setCustomValidity('');
                });
            }
            
            // 特定の入力タイプに応じたバリデーション
            if (input.type === 'email') {
                input.addEventListener('invalid', function() {
                    if (input.value !== '' && !input.validity.valid) {
                        input.setCustomValidity('有効なメールアドレスを入力してください');
                    }
                });
            }
        });
        
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // reCAPTCHAの検証
            if (typeof grecaptcha !== 'undefined') {
                const recaptchaResponse = grecaptcha.getResponse();
                if (!recaptchaResponse) {
                    alert('reCAPTCHAにチェックを入れてください。');
                    return;
                }
            }
            
            // フォームデータの取得
            const formData = new FormData(applicationForm);
            
            // 送信ボタンを無効化
            const submitButton = applicationForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '送信中...';
            }
            
            // 成功メッセージの表示
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.innerHTML = '<i class="fas fa-check-circle"></i> お申し込みありがとうございます！担当者より折り返しご連絡いたします。';
            
            // ここにフォーム送信のAjaxコードを追加
            // 例: fetch('/submit-form', { method: 'POST', body: formData })
            //   .then(response => response.json())
            //   .then(data => {
            //     console.log('Success:', data);
            //     // 成功時の処理
            //   })
            //   .catch(error => {
            //     console.error('Error:', error);
            //     // エラー時の処理
            //   });
            
            // デモ用：送信成功の代わりにタイムアウトを使用
            setTimeout(function() {
                // フォームを非表示
                applicationForm.style.display = 'none';
                
                // 成功メッセージを表示
                applicationForm.parentNode.insertBefore(successMessage, applicationForm.nextSibling);
                
                // フォームをリセット
                applicationForm.reset();
                
                // reCAPTCHAをリセット
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
                
                // 送信ボタンを再度有効化
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '申し込む';
                }
                
                // 5秒後にフォームを再表示
                setTimeout(function() {
                    successMessage.remove();
                    applicationForm.style.display = 'block';
                }, 5000);
            }, 1000);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // プライバシーポリシーへのリンクを明示的に処理
    const privacyLinks = document.querySelectorAll('a[href*="privacy-policy.html"]');
    
    privacyLinks.forEach(link => {
        // 既存のイベントリスナーを全て削除
        const clone = link.cloneNode(true);
        link.parentNode.replaceChild(clone, link);
        
        // 新しいイベントハンドラを追加
        clone.addEventListener('click', function(e) {
            // 他のイベントハンドラをキャンセル
            e.stopPropagation();
            
            // 明示的にページ遷移
            window.location.href = this.getAttribute('href');
            
            // デフォルトの処理も防止
            e.preventDefault();
            
            // リターンfalseで全てのイベント伝播を止める
            return false;
        });
    });
});