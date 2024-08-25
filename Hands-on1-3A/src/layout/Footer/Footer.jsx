import './Footer.css'

function Footer(){
    return(
        <footer>
            <div className="top-footer">
                <p>Franc Alvenn Dela Cruz .</p>
            </div>
            <div className="footer-social-icons">
                <a href='https://www.facebook.com/francalvenn' className="icon"><i className="uil uil-facebook-f"></i></a>
                <a href='https://www.linkedin.com/in/franc-alvenn-dela-cruz/' className="icon"><i className="uil uil-linkedin-alt"></i></a>
                <a href='https://github.com/FrancAlvenn' className="icon"><i className="uil uil-github-alt"></i></a>
            </div>
            <div className="bottom-footer">
                <p>Copyright &copy; Franc Alvenn Dela Cruz - All rights reserved</p>
            </div>
        </footer>
    )
}

export default Footer;