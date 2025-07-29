// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
        address author; 
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(uint id, string content, bool completed, address author);
    event TaskCompleted(uint id, bool completed);
    event TaskDeleted(uint id);

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false, msg.sender); 
        emit TaskCreated(taskCount, _content, false, msg.sender);
    }

    function toggleCompleted(uint _id) public {
        require(tasks[_id].author == msg.sender, "Not authorized");
        Task storage task = tasks[_id];
        task.completed = !task.completed;
        emit TaskCompleted(_id, task.completed);
    }

    function deleteTask(uint _id) public {
        require(tasks[_id].author == msg.sender, "Not authorized");
        delete tasks[_id];
        emit TaskDeleted(_id);
    }
}
