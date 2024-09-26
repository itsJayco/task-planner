import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TaskCreationComponent {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      deadline: ['', Validators.required],
      persons: this.fb.array([]),
    });
  }

  get persons() {
    return this.taskForm.get('persons') as FormArray;
  }

  getSkills(person: AbstractControl): FormArray {
    return (person as FormGroup).get('skills') as FormArray;
  }

  addPerson() {
    const personForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array([this.fb.control('', Validators.required)]),
    });
    this.persons.push(personForm);
  }

  removePerson(index: number) {
    this.persons.removeAt(index);
  }

  addSkill(personIndex: number) {
    const skills = this.getSkills(this.persons.at(personIndex));
    skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(personIndex: number, skillIndex: number) {
    const skills = this.getSkills(this.persons.at(personIndex));
    skills.removeAt(skillIndex);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask = {
        name: this.taskForm.value.name,
        deadline: new Date(this.taskForm.value.deadline),
        persons: this.taskForm.value.persons,
      };
      this.taskService.addTask(newTask);
      this.taskForm.reset();
    }
  }
}