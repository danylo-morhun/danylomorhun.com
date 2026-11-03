// Old links to /resume.pdf keep working after the rename.
export default defineEventHandler(event => sendRedirect(event, '/Danylo_Morhun_Fullstack_Engineer_Resume.pdf', 301))
