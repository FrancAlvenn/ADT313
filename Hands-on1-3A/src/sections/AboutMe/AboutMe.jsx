import './AboutMe.css'

function AboutMe(){
    return(
        <div className='container'>
            <div className='top-header'><h2>About Me</h2></div>

            <div className="row">
                <div className="col">
                    <div className="about-info">
                        <h3>My Introduction</h3>
                        <p>Hello, I'm Franc Alvenn Dela Cruz, a developer skilled in HTML, CSS, JavaScript, PHP, MySQL, Visual Basic, Java, and Python.
                            I focus on building functional and user-friendly websites and applications.
                            Feel free to explore my work and connect with me on new projects.</p>
                        <div className="about-btn">
                            <a href='/Dela Cruz, Franc Alvenn - CV (2024).pdf' className="btn" download={"/Dela Cruz, Franc Alvenn - CV (2024).pdf"}>Download CV <i class="uil uil-file-alt"></i></a>
                        </div>
                    </div>
                </div>

                <div className="col skills-col">
                    <div className="skills-box">
                        <div className="skill-header">
                            <h3>Frontend</h3>
                        </div>
                        <div className="skills-list">
                            <span>HTML</span>
                            <span>CSS</span>
                            <span>Bootstrap</span>
                            <span>JavaScript</span>
                        </div>
                    </div>
                    <div className="skills-box">
                        <div className="skill-header">
                            <h3>Backend</h3>
                        </div>
                        <div className="skills-list">
                            <span>PHP</span>
                            <span>Java </span>
                            <span>Python</span>
                        </div>
                    </div>
                    <div className="skills-box">
                        <div className="skill-header">
                            <h3>Database</h3>
                        </div>
                        <div className="skills-list">
                            <span>MySQL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AboutMe