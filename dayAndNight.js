const toggleIcon = document.querySelector('.toggleMode i');

toggleIcon.addEventListener('click',()=>{
    if(toggleIcon.classList.contains('ri-moon-line')){
        toggleIcon.classList.remove('ri-moon-line')
        toggleIcon.classList.add('ri-sun-line');

        document.body.style.backgroundColor = '#0a0a0a';
        
        document.querySelector('.logo').style.backgroundColor = 'rgba(255,255,255,8%)';
        document.querySelector('.logo').style.color = '#fff';
        document.querySelector('.input-container').style.backgroundColor = 'rgba(255,255,255,8%)';
        document.querySelector('.input-container button').style.color = '#fff';
        document.querySelector('.input-container input').style.color = '#fff';
        
        document.querySelector('.getLocation').style.backgroundColor = 'rgba(255,255,255,8%)';
        document.querySelector('.getLocation').style.color = '#fff';
        
        document.querySelector('.toggleMode').style.backgroundColor = 'rgba(255,255,255,8%)';
        document.querySelector('.toggleMode').style.color = '#fff';
        
        document.querySelector('.sourceCode').style.backgroundColor = '#fff';
        document.querySelector('.sourceCode i').style.color = '#0a0a0a';
        
        document.querySelector('.left').style.backgroundColor = 'rgba(255,255,255,8%)';
        document.querySelector('.left').style.color = '#fff';
        
        document.querySelector('.currDate').style.backgroundColor = 'rgba(255,255,255,8%)';
        document.querySelector('.currDate').style.color = '#fff';
        
        document.querySelector('.currLocation').style.backgroundColor = 'rgba(255,255,255,8%)';
        document.querySelector('.currLocation').style.color = '#fff';
        

        document.querySelectorAll('.infoBox').forEach(ele=>{
            ele.style.backgroundColor = 'rgba(255,255,255,8%)';
            ele.style.color = '#fff';
        })

        document.querySelectorAll('.parameter').forEach(ele=>{
            ele.style.color = '#ddd';
        });

        document.querySelector('footer p').style.color = '#fff';

    }
    
    else if(toggleIcon.classList.contains('ri-sun-line')){
        toggleIcon.classList.remove('ri-sun-line')
        toggleIcon.classList.add('ri-moon-line');
        
        document.body.style.backgroundColor = '#fff';

        document.querySelector('.logo').style.backgroundColor = 'rgba(0,0,0,0.05)';
        document.querySelector('.logo').style.color = '#0a0a0a';
        document.querySelector('.input-container').style.backgroundColor = 'rgba(0,0,0,0.05)';
        document.querySelector('.input-container button').style.color = '#0a0a0a';
        document.querySelector('.input-container input').style.color = '#0a0a0a';
        
        document.querySelector('.getLocation').style.backgroundColor = 'rgba(0,0,0,0.05)';
        document.querySelector('.getLocation').style.color = '#0a0a0a';
        
        document.querySelector('.toggleMode').style.backgroundColor = 'rgba(0,0,0,0.05)';
        document.querySelector('.toggleMode').style.color = '#0a0a0a';
        
        document.querySelector('.sourceCode').style.backgroundColor = '#0a0a0a';
        document.querySelector('.sourceCode i').style.color = '#fff';
        
        document.querySelector('.left').style.backgroundColor = 'rgba(0,0,0,0.05)';
        document.querySelector('.left').style.color = '#0a0a0a';
        
        document.querySelector('.currDate').style.backgroundColor = 'rgba(0,0,0,0.05)';
        document.querySelector('.currDate').style.color = '#0a0a0a';
        
        document.querySelector('.currLocation').style.backgroundColor = 'rgba(0,0,0,0.05)';
        document.querySelector('.currLocation').style.color = '#0a0a0a';
        

        document.querySelectorAll('.infoBox').forEach(ele=>{
            ele.style.backgroundColor = 'rgba(0,0,0,0.05)';
            ele.style.color = '#0a0a0a';
        });

        document.querySelectorAll('.parameter').forEach(ele=>{
            ele.style.color = '#111';
        });


        document.querySelector('footer p').style.color = '#0a0a0a';
    }
})