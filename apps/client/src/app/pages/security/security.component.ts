import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

interface SecurityFramework {
  icon: string;
  title: string;
  description: string;
}

interface DevelopmentStep {
  number: number;
  title: string;
  description: string;
}

interface Certification {
  logo: string;
  name: string;
  description: string;
}

interface Resource {
  title: string;
  description: string;
}

@Component({
  selector: 'app-security',
  standalone: false,
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  isLoading: boolean = false;
  errorMessage: string = '';

  // 安全统计数据
  securityStats = {
    frameworks: 6,
    certifications: 4,
    resources: 3
  };

  // 安全框架数据
  securityFrameworks: SecurityFramework[] = [
    {
      icon: '🔒',
      title: 'Code Integrity',
      description: 'Ensure the authenticity and integrity of your code throughout the development lifecycle with cryptographic signatures and verification.'
    },
    {
      icon: '🛡️',
      title: 'Dependency Scanning',
      description: 'Automatically scan and analyze third-party dependencies for known vulnerabilities and license compliance issues.'
    },
    {
      icon: '🔍',
      title: 'Vulnerability Management',
      description: 'Continuous monitoring and assessment of security vulnerabilities with automated patching and remediation workflows.'
    },
    {
      icon: '🔐',
      title: 'Access Control',
      description: 'Implement least-privilege access policies and multi-factor authentication across your development infrastructure.'
    },
    {
      icon: '📊',
      title: 'Compliance Monitoring',
      description: 'Track and enforce compliance with industry standards and regulatory requirements through automated auditing.'
    },
    {
      icon: '🚨',
      title: 'Threat Detection',
      description: 'Advanced anomaly detection and behavioral analysis to identify potential security threats in real-time.'
    }
  ];

  // 开发步骤数据
  developmentSteps: DevelopmentStep[] = [
    {
      number: 1,
      title: 'Secure Code Development',
      description: 'Implement secure coding practices, conduct code reviews, and use static application security testing (SAST) tools to identify vulnerabilities early in the development process.'
    },
    {
      number: 2,
      title: 'Dependency Management',
      description: 'Maintain an inventory of all third-party components, continuously monitor for vulnerabilities, and establish policies for timely updates and patches.'
    },
    {
      number: 3,
      title: 'Build Integrity',
      description: 'Implement reproducible builds, cryptographic signing of artifacts, and secure build environments to prevent tampering during the compilation process.'
    },
    {
      number: 4,
      title: 'Deployment Security',
      description: 'Enforce secure deployment practices with integrity checks, environment isolation, and runtime protection mechanisms.'
    },
    {
      number: 5,
      title: 'Continuous Monitoring',
      description: 'Monitor applications and infrastructure in production for security incidents, anomalous behavior, and emerging threats.'
    }
  ];

  // 认证数据
  certifications: Certification[] = [
    {
      logo: '🔏',
      name: 'ISO 27001',
      description: 'Information Security Management'
    },
    {
      logo: '🛡️',
      name: 'NIST Framework',
      description: 'Cybersecurity Best Practices'
    },
    {
      logo: '⚖️',
      name: 'SOC 2 Type II',
      description: 'Security & Availability Controls'
    },
    {
      logo: '🔐',
      name: 'OWASP ASVS',
      description: 'Application Security Verification'
    }
  ];

  // 资源数据
  resources: Resource[] = [
    {
      title: 'Software Supply Chain Security Guide',
      description: 'Comprehensive guide to implementing security practices across your development pipeline.'
    },
    {
      title: 'Security Policy Template',
      description: 'Template for creating organization-wide software supply chain security policies.'
    },
    {
      title: 'Vulnerability Assessment Checklist',
      description: 'Checklist for conducting thorough vulnerability assessments of your software components.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadSecurityData();
  }

  loadSecurityData(): void {
    this.isLoading = true;
    // 模拟数据加载
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  downloadResource(resourceTitle: string): void {
    console.log(`Downloading: ${resourceTitle}`);
    // 这里可以添加实际的下载逻辑
    alert(`Downloading: ${resourceTitle}`);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    // 实现登出逻辑
    console.log('Logging out...');
    this.router.navigate(['/login']);
  }

  // 爱心拖尾效果
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.createHeartTrail(event.clientX, event.clientY);
  }

  createHeartTrail(x: number, y: number): void {
    const heartSizes = ['small', 'medium', 'large'];
    const heartColors = ['gold', 'pink', 'white', 'green'];

    const size = heartSizes[Math.floor(Math.random() * heartSizes.length)];
    const color = heartColors[Math.floor(Math.random() * heartColors.length)];

    const heart = document.createElement('div');
    heart.className = `trail-heart ${size} ${color}`;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    const trailContainer = document.getElementById('trailContainer');
    if (trailContainer) {
      trailContainer.appendChild(heart);

      // 动画结束后移除元素
      setTimeout(() => {
        if (trailContainer.contains(heart)) {
          trailContainer.removeChild(heart);
        }
      }, 800);
    }
  }
}
