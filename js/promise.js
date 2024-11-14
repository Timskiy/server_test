async function fetchData() {
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) {
        throw new Error('Ошибка сети');
      }
      const data = await response.json();
      console.log('Полученные данные:', data);
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  }
  
  fetchData();
  