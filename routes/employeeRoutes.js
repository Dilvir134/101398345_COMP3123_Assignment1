const express = require('express');
const employeeModel = require('../models/employeeModel');

const router = express.Router();

router.get('/employees', (req, res) => {
    employeeModel.find()
        .then((employees) => {
        res.send(employees.map(employee => {
            return {
                employee_id: employee._id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                position: employee.position,
                salary: employee.salary,
                date_of_joining: employee.date_of_joining,
                department: employee.department
            }
        }));
    }).catch((err) => {
        res.status(500).send({message: err.message});
    })
});

router.post('/employees', async(req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }
    const empData = req.body;
    try {
        const employee = new employeeModel(empData);
        const newEmployee = await employee.save()
        res.send({
            message: "Employee created successfully",
            employee_id: newEmployee._id
        });
    }
    catch (err) {
        res.status(500).send({message: err.message});
    }
})

router.get('/employees/:empid', (req, res) => {
    employeeModel.findById(req.params.empid)
        .then((employee) => {
            if (employee) {
                res.send({
                    employee_id: employee._id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email,
                    position: employee.position,
                    salary: employee.salary,
                    date_of_joining: employee.date_of_joining,
                    department: employee.department
                })
            }
            else {
                res.status(404).send({message: "Employee with that id not found"});
            }
        }).catch(err => {
            res.status(500).send({message: err.message});
    })
})

router.put('/employees/:empid', (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Employee content can not be empty"
        });
    }
    req.body["updatedAt"] = Date.now();
    employeeModel.findByIdAndUpdate(req.params.empid, req.body, {new: true})
        .then(employee => {
            if (employee) {
                res.send({
                    "message": "Employee details updated successfully."
                });
            }
            else {
                res.status(404).send({message: "Employee with that id not found"});
            }
        }).catch((err) => {
            res.status(500).send({message: err.message});
    })
})

router.delete('/employees', (req, res) => {
    employeeModel.findByIdAndDelete(req.query.eid)
        .then((employee) => {
            if (employee) {
                res.send({
                    message: "Employee deleted successfully."
                })
            }
            else {
                res.status(404).send({message: "Employee with that id not found"});
            }
        }).catch((err) => {
            res.stats(500).send({message: err.message})
    })
})

module.exports = router;