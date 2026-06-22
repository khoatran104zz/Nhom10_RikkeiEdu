package com.company.sales_management.service.impl;

import com.company.sales_management.config.JwtTokenProvider;
import com.company.sales_management.dto.request.LoginRequest;
import com.company.sales_management.dto.response.LoginResponse;
import com.company.sales_management.dto.response.UserResponse;
import com.company.sales_management.entity.User;
import com.company.sales_management.exception.BadRequestException;
import com.company.sales_management.repository.UserRepository;
import com.company.sales_management.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public LoginResponse login(LoginRequest request) {
        String identifier = request.getUsername().trim();
        User user = findByUsernameOrEmail(identifier)
                .orElseThrow(() -> new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng"));

        if (!user.getActive()) {
            throw new BadRequestException("Tài khoản đã bị vô hiệu hóa");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng");
        }

        String token = jwtTokenProvider.generateToken(user.getUsername());

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setFullName(user.getFullName());
        userResponse.setEmail(user.getEmail());
        userResponse.setPhone(user.getPhone());
        userResponse.setActive(user.getActive());
        if (user.getRole() != null) {
            userResponse.setRoleId(user.getRole().getId());
            userResponse.setRoleName(user.getRole().getName());
        }
        if (user.getBranch() != null) {
            userResponse.setBranchId(user.getBranch().getId());
            userResponse.setBranchName(user.getBranch().getName());
        }

        return new LoginResponse(token, userResponse);
    }
    private Optional<User> findByUsernameOrEmail(String identifier) {
        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier));
    }
}
