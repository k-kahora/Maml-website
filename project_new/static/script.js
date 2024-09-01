
document.getElementById('text-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    
    const textarea = document.getElementById('resizable-input');
    const text = textarea.value;

    const response = await fetch('/submit-text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'input_text': text
        })
    });

    const result = await response.json();
    document.getElementById('response').innerText = result.message;

});
