// ============================================================
// TASK 1: LOCAL SETUP AND DATA CREATION
// ============================================================
db.dropDatabase();

use company;

db.employees.insertMany([
    {
        _id: "EMP001",
        name: "John",
        department: "Engineering",
        experience: 4,
        skills: ["Java", "Spring Boot"],
        active: true,
        address: {
            city: "Pune",
            country: "India"
        }
    },
    {
        _id: "EMP002",
        name: "Alice",
        department: "HR",
        experience: 3,
        skills: ["Recruitment", "Communication"],
        active: true,
        address: {
            city: "Mumbai",
            country: "India"
        }
    },
    {
        _id: "EMP003",
        name: "David",
        department: "Engineering",
        experience: 6,
        skills: ["Java", "MongoDB"],
        active: true,
        address: {
            city: "Bengaluru",
            country: "India"
        }
    },
    {
        _id: "EMP004",
        name: "Emma",
        department: "Finance",
        experience: 2,
        skills: ["Accounting", "Excel"],
        active: false,
        address: {
            city: "Pune",
            country: "India"
        }
    },
    {
        _id: "EMP005",
        name: "Robert",
        department: "Engineering",
        experience: 5,
        skills: ["Java", "Docker"],
        active: true,
        address: {
            city: "Delhi",
            country: "India"
        }
    }
]);


// ------------------------------------------------------------
// Verify database and collection.
// ------------------------------------------------------------

show dbs;

show collections;

db.employees.countDocuments();

db.employees.find();

// ============================================================
// TASK 2: READ AND QUERY OPERATIONS
// ============================================================


// ------------------------------------------------------------
// 2.1 Engineering Employees
//
// Retrieve employees whose department is Engineering.
// Return only:
//   - _id
//   - name
//   - experience
// Sort by name in ascending order.
//
// Expected:
// David
// John
// Robert
// ------------------------------------------------------------

db.employees.find(
    {
        department: "Engineering"
    },
    {
        _id: 1,
        name: 1,
        experience: 1
    }
).sort({
    name: 1
});


// ------------------------------------------------------------
// 2.2 Employees with 5 or More Years of Experience
//
// Return only:
//   - name
//   - experience
// Exclude _id.
// Sort by experience in descending order.
//
// Expected:
// David -> 6
// Robert -> 5
// ------------------------------------------------------------

db.employees.find(
    {
        experience: {
            $gte: 5
        }
    },
    {
        _id: 0,
        name: 1,
        experience: 1
    }
).sort({
    experience: -1
});


// ------------------------------------------------------------
// 2.3 Nested Document Query
//
// Retrieve employees whose address.city is Pune.
// Return only:
//   - name
//   - city
// Sort by name.
//
// Expected:
// Emma
// John
//
// Dot notation is used to access the nested address.city field.
// ------------------------------------------------------------

db.employees.find(
    {
        "address.city": "Pune"
    },
    {
        _id: 0,
        name: 1,
        "address.city": 1
    }
).sort({
    name: 1
});


// ------------------------------------------------------------
// 2.4 Array Query
//
// Using $in, retrieve employees whose skills contain either:
//   - MongoDB
//   - Spring Boot
//
// Sort by name in ascending order.
//
// Expected:
// David
// John
// ------------------------------------------------------------

db.employees.find(
    {
        skills: {
            $in: ["MongoDB", "Spring Boot"]
        }
    },
    {
        _id: 0,
        name: 1
    }
).sort({
    name: 1
});


// ------------------------------------------------------------
// 2.5 Sorting and Limiting
//
// Retrieve the top 2 employees with the highest experience.
// Return:
//   - name
//   - experience
//
// Expected:
// David -> 6
// Robert -> 5
// ------------------------------------------------------------

db.employees.find(
    {},
    {
        _id: 0,
        name: 1,
        experience: 1
    }
).sort({
    experience: -1
}).limit(2);


// ============================================================
// TASK 3: UPDATE OPERATIONS
// ============================================================


// ------------------------------------------------------------
// 3.1 $inc
//
// Increase Alice's experience by 1.
//
// Before:
// Alice -> experience: 3
//
// After:
// Alice -> experience: 4
// ------------------------------------------------------------

db.employees.updateOne(
    {
        name: "Alice"
    },
    {
        $inc: {
            experience: 1
        }
    }
);


// Verify Alice's updated experience.

db.employees.findOne(
    {
        name: "Alice"
    }
);


// ------------------------------------------------------------
// 3.2 $set
//
// Change Emma's active value from false to true.
// ------------------------------------------------------------

db.employees.updateOne(
    {
        name: "Emma"
    },
    {
        $set: {
            active: true
        }
    }
);


// Verify Emma's updated active value.

db.employees.findOne(
    {
        name: "Emma"
    }
);


// ------------------------------------------------------------
// 3.3 $addToSet
//
// Add MongoDB to Robert's skills array.
//
// Robert initially has:
// ["Java", "Docker"]
//
// After update:
// ["Java", "Docker", "MongoDB"]
// ------------------------------------------------------------

db.employees.updateOne(
    {
        name: "Robert"
    },
    {
        $addToSet: {
            skills: "MongoDB"
        }
    }
);


// Verify Robert's skills.

db.employees.findOne(
    {
        name: "Robert"
    }
);


// ------------------------------------------------------------
// Execute the same $addToSet operation again.
//
// MongoDB should NOT add a duplicate "MongoDB" value.
// ------------------------------------------------------------

db.employees.updateOne(
    {
        name: "Robert"
    },
    {
        $addToSet: {
            skills: "MongoDB"
        }
    }
);


// Verify that MongoDB was not duplicated.

db.employees.findOne(
    {
        name: "Robert"
    }
);


// ============================================================
// TASK 4: DELETE OPERATION
// ============================================================


// ------------------------------------------------------------
// Insert the temporary document.
// ------------------------------------------------------------

db.employees.insertOne({
    _id: "EMP999",
    name: "Temporary Employee",
    department: "Training",
    experience: 0
});


// Verify the temporary document exists.

db.employees.findOne({
    _id: "EMP999"
});


// ------------------------------------------------------------
// Delete only the temporary document using deleteOne().
// ------------------------------------------------------------

db.employees.deleteOne({
    _id: "EMP999"
});


// ------------------------------------------------------------
// Verify that the temporary document was deleted.
// Expected result:
// null
// ------------------------------------------------------------

db.employees.findOne({
    _id: "EMP999"
});


// ------------------------------------------------------------
// Verify that the original five employees remain.
// Expected count:
// 5
// ------------------------------------------------------------

db.employees.countDocuments();

db.employees.find();


// ============================================================
// TASK 5: INDEXING
// ============================================================


// ------------------------------------------------------------
// 5.1 Check Existing Indexes
//
// MongoDB automatically creates an index on _id.
// ------------------------------------------------------------

db.employees.getIndexes();


// Expected initial index:
// _id_


// ------------------------------------------------------------
// 5.2 Create an ascending index on department.
// ------------------------------------------------------------

db.employees.createIndex({
    department: 1
});


// Expected returned index name:
// department_1


// ------------------------------------------------------------
// 5.3 Verify the Index
//
// Expected indexes:
//   _id_
//   department_1
// ------------------------------------------------------------

db.employees.getIndexes();


// ============================================================
// TASK 6: AGGREGATION
// ============================================================


// ------------------------------------------------------------
// 6.1 Employees per Department
//
// Count the number of employees in each department.
// Sort by department name in ascending order.
//
// Expected:
// Engineering -> 3
// Finance     -> 1
// HR          -> 1
// ------------------------------------------------------------

db.employees.aggregate([
    {
        $group: {
            _id: "$department",
            totalEmployees: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            _id: 1
        }
    }
]);


// ------------------------------------------------------------
// 6.2 Average Experience per Department
//
// Calculate the average experience for each department.
// Sort by department name in ascending order.
//
// Expected:
// Engineering -> 5
// Finance     -> 2
// HR          -> 4
// ------------------------------------------------------------

db.employees.aggregate([
    {
        $group: {
            _id: "$department",
            averageExperience: {
                $avg: "$experience"
            }
        }
    },
    {
        $sort: {
            _id: 1
        }
    }
]);


// ------------------------------------------------------------
// 6.3 Top Engineering Employees
//
// Requirements:
// 1. Select only Engineering employees.
// 2. Return only name and experience.
// 3. Exclude _id.
// 4. Sort experience in descending order.
// 5. Return only the top 2 employees.
//
// Expected:
// David -> 6
// Robert -> 5
// ------------------------------------------------------------

db.employees.aggregate([
    {
        $match: {
            department: "Engineering"
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            experience: 1
        }
    },
    {
        $sort: {
            experience: -1
        }
    },
    {
        $limit: 2
    }
]);
