import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Person, Task, TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
})
export class TaskCreationComponent implements OnInit {
  taskForm: FormGroup;
  personForm: FormGroup;
  showAddPerson: boolean = false;
  addedPersons: Person[] = [];
  phrases: string[] = [
    'ORGANIZE YOUR TASKS EFFICIENTLY',
    'TURN YOUR IDEAS INTO ACTION',
    'GET THINGS DONE FASTER',
    'LET’S CREATE SOMETHING AMAZING',
    'START YOUR TASK, ACHIEVE YOUR GOAL',
    'EVERY TASK BRINGS YOU CLOSER TO SUCCESS',
    'DEFINE YOUR NEXT STEP',
    'PLAN. ACT. ACHIEVE.',
  ];
  selectedPhrase: string = '';
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      deadline: ['', Validators.required],
    });

    this.personForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array([this.fb.control('', [Validators.required])]),
    });
  }

  ngOnInit(): void {
    this.getRandomPhrase();
    if (this.data) {
      this.isEditing = true;
      this.taskForm.patchValue({
        name: this.data.name,
        deadline: this.data.deadline,
      });

      if (this.data.persons && this.data.persons.length > 0) {
        this.addedPersons = [...this.data.persons];
        this.showAddPerson = true;
      } else {
        this.addedPersons = [];
        this.showAddPerson = false;
      }

      this.personForm.reset();
      this.skills.clear();
      this.addSkill();
    }
  }

  getRandomPhrase(): void {
    const randomIndex = Math.floor(Math.random() * this.phrases.length);
    this.selectedPhrase = this.phrases[randomIndex];
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
      this.personForm.markAsPristine();
      this.personForm.markAsUntouched();

      this.personForm.get('fullName')?.setErrors(null);
      this.personForm.get('age')?.setErrors(null);


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
      const newTask: Omit<Task, 'id'> = {
        name: this.taskForm.value.name,
        deadline: new Date(this.taskForm.value.deadline),
        completed: this.data ? this.data.completed : false,
        persons: this.showAddPerson ? this.addedPersons : [],
      };

      if (
        !this.data ||
        (this.data &&
          new Date(this.data.deadline).getTime() !== newTask.deadline.getTime())
      ) {
        const timezoneOffset = newTask.deadline.getTimezoneOffset() * 60 * 1000;
        newTask.deadline = new Date(
          newTask.deadline.getTime() + timezoneOffset
        );
      }

      if (this.data) {
        const updatedTask: Task = { ...newTask, id: this.data.id };
        this.taskService.updateTask(updatedTask);
      } else {
        this.taskService.addTask(newTask);
      }

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
      this.personForm.reset();
      this.skills.clear();
      this.addSkill();
    }
  }

  isAddPersonDisabled(): boolean {
    return (
      this.personForm.invalid ||
      this.skills.controls.every((control) => !control.value.trim())
    );
  }
}
