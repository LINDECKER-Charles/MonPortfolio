import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HomeResumeSnippetState } from '../home-resume.state';
import { ResponsiveSource } from '../../../../assets/responsive-picture/responsive-picture';
import {HomeResumePhoto} from './home-resume-photo/home-resume-photo';
import {HomeResumeSnippets} from './home-resume-snippets/home-resume-snippets';

@Component({
  selector: 'app-home-resume-content',
  imports: [CommonModule, HomeResumePhoto, HomeResumeSnippets],
  templateUrl: './home-resume-content.html',
  styleUrl: './home-resume-content.css',
})
export class HomeResumeContent {
  @Input({ required: true }) photoSources: ResponsiveSource[] = [];
  @Input({ required: true }) photoFallback = '';
  @Input({ required: true }) snippets: HomeResumeSnippetState[] = [];
}
