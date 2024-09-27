import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Person, TaskService } from '../../services/task.service';
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
  personForm: FormGroup;
  showAddPerson: boolean = false;
  addedPersons: Person[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskCreationComponent>
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      deadline: ['', Validators.required],
    });

    this.personForm = this.fb.group({
      fullName: ['', []],
      age: ['', []],
      skills: this.fb.array([this.fb.control('')]),
    });
  }

  get skills() {
    return this.personForm.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  addPerson() {
    if (this.personForm.valid) {
      const newPerson: Person = {
        fullName: this.personForm.value.fullName,
        age: this.personForm.value.age,
        skills: this.personForm.value.skills.filter(
          (skill: string) => skill.trim() !== ''
        ),
      };
      this.addedPersons.push(newPerson);
      this.personForm.reset();
      this.skills.clear();
      this.addSkill();
    }
  }

  removePerson(index: number) {
    this.addedPersons.splice(index, 1);
  }

  onSubmit() {
    if (
      this.taskForm.valid &&
      (!this.showAddPerson || this.addedPersons.length > 0)
    ) {
      const newTask = {
        name: this.taskForm.value.name,
        deadline: new Date(this.taskForm.value.deadline),
        persons: this.showAddPerson ? this.addedPersons : [],
      };

      const timezoneOffset = newTask.deadline.getTimezoneOffset() * 60 * 1000;
      newTask.deadline = new Date(newTask.deadline.getTime() + timezoneOffset);

      this.taskService.addTask(newTask);
      this.taskForm.reset();
      this.addedPersons = [];
      this.showAddPerson = false;
      this.onCloseDialog();
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  toggleAddPerson() {
    this.showAddPerson = !this.showAddPerson;
    if (!this.showAddPerson) {
      this.addedPersons = [];
    }
  }

  isAddPersonDisabled(): boolean {
    return (
      this.personForm.invalid ||
      this.skills.length === 0 ||
      this.skills.controls.every((control) => !control.value)
    );
  }
}
