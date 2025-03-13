# 1Day1Quote

1Day1Quote is a personal project designed to display a random quote each day. The user can see the quote of the day, the author, and a brief biography of the author. Additionally, the user can generate a new quote as many times as they want. This project is developed using Vue.js, Tailwind CSS.

<p align="center">
  <img width="521" alt="Image" src="https://github.com/user-attachments/assets/732ac1a0-e342-4485-be55-3499163963ea" />
</p>

## Technologies

- **Vue.js**: JavaScript framework used to build the application.
- **Tailwind CSS**: Used for fast and responsive design of the app.
- **JavaScript**: Programming language used for the app's logic.

## Features

- **Random Quote of the Day**: Displays a different quote every day.
- **Author and Biography**: The user can see the author of the quote along with a brief biography of that author.
- **Generate a New Quote**: The user can generate as many quotes as they want with a single click.
- **Cache Quotes and Images**: To improve performance, quotes and images are cached.
- **Toggle Author Information**: The user can choose to display or hide the information about the author.
- **Pre-fetch Quotes**: The app pre-fetches quotes for a smoother user experience.

## Installation

1. Clone this repository to your local machine:

    ```bash
    git clone [https://github.com/your-username/1Day1Quote.git](https://github.com/itsyanis/1Day1Quote.git)
    ```

2. Navigate to the project directory:

    ```bash
    cd 1Day1Quote
    ```

3. Install the dependencies using npm:

    ```bash
    npm install
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

5. Open your browser and go to [http://localhost:5173](http://localhost:5173) ✨.

## How It Works

The app fetches random quotes from the [API Ninjas]([https://api.quotable.io](https://www.api-ninjas.com/)) API and author information from the [Wikipedia](https://en.wikipedia.org/w/api.php) API. Each quote is cached to speed up future loads. Author information can be toggled on or off based on user preference.


## Data Validation and Security

The project implements validation and security measures to ensure that only reliable and secure data is displayed to the user.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Yanis.M**: Creator and main developer.

