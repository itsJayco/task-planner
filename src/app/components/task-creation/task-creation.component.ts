import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
})
export class TaskCreationComponent {
  taskForm: FormGroup;
  showAddPerson: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskCreationComponent>
  ) {
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

      const timezoneOffset = newTask.deadline.getTimezoneOffset() * 60 * 1000;
      newTask.deadline = new Date(newTask.deadline.getTime() + timezoneOffset);

      this.taskService.addTask(newTask);
      this.taskForm.reset();

      this.onCloseDialog();
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  toggleAddPerson() {
    this.showAddPerson = !this.showAddPerson
  }
}
