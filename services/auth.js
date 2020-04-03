const pool = require("../configs/database")
const rand = require("../helpers/rand")
const nodemailer = require("nodemailer")



exports.login = async (req, res) => {
    const conn = await pool.connect()
    const { username, password } = req.body
    try {
        const resUser = await conn.query(`SELECT * FROM public.users WHERE username = $1`, [username])
        if (resUser.rows.length > 0) {
            const result = await conn.query(`SELECT * FROM public.users WHERE username = $1 AND password = $2`, [username, password])
            if (result.rows.length > 0) {
                res.send(result.rows[0])
            } else {
                res.send({ failed: `Password tidak sesuai dengan username.` })
            }
        } else {
            res.send({ failed: `Username tidak ditemukan.` })
        }
    } catch (err) {
        console.log(err.stack)
    } finally {    
        conn.release()
    }
}

exports.forgot = async (req, res) => {
    const conn = await pool.connect()
    const email = req.params.email
    try {
        const newPassword = rand(5)
        const result = await conn.query(`UPDATE public.users SET password = $1 WHERE email = $2`, [newPassword, email])
        
        if (result.rowCount > 0) {
            var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'yourbotmail@gmail.com',
                        pass: 'yourpasswordforbotmail'
                    }
                })
                
            const mailConfig = {
                from: 'dary.mailer.bot@gmail.com',
                to: email,
                subject: 'Pemberitahuan Password Baru untuk aplikasi RSUD.',
                html: `Password baru aplikasi rsud anda adalah: <b>${newPassword}</b>`
            }
            
            transporter.sendMail(mailConfig, function(error, info){
                if (error) {
                    res.send({ failed : `Kesalahan ketika mengirim email, ini berhubungan dengan service api.` })
                    console.log(error)
                } else {
                    res.send({ success : `Password lama berhasil di reset ulang, password baru dikirimkan ke email ${email} anda.` })
                }
            })
        } else {
            res.send({ failed : `Email tidak sesuai dengan akun manapun, pastikan email benar.` })
        }
    } catch (err) {
        console.log(err.stack)
    } finally {    
        conn.release()
    }
}