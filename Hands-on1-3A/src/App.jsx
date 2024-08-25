import logo from './logo.svg';
import './App.css';
import Header from './layout/Header/Header';
import Featured from './sections/Featured/Featured';
import AboutMe from './sections/AboutMe/AboutMe';
import Footer from './layout/Footer/Footer';


function App() {
  const userInformation = {
    firstName: "Franc Alvenn",
    lastName: "Dela Cruz",
    section : "BSIT 3A",
    description: "I am an enthusiastic and driven 3rd year Bachelor of Science in Information Technology student."
  }
  return (
    <div className="App">
        <Header />
        <Featured firstName={userInformation.firstName} lastName={userInformation.lastName}
              section={userInformation.section} description={userInformation.description}/>
        <AboutMe />
        <Footer />
    </div>
  );
}

export default App;
